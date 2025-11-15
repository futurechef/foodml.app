from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import get_settings
from app.models import User
from app.database import get_db

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


class AuthService:
    """Service for authentication operations."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt."""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(user_id: int, expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token."""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

        to_encode = {
            "sub": str(user_id),
            "exp": expire,
            "iat": datetime.utcnow(),
        }

        encoded_jwt = jwt.encode(
            to_encode,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )
        return encoded_jwt

    @staticmethod
    def decode_token(token: str) -> Optional[int]:
        """
        Decode a JWT token and return the user ID.

        Returns:
            User ID if valid, None otherwise
        """
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
            user_id: str = payload.get("sub")
            if user_id is None:
                return None
            return int(user_id)
        except JWTError:
            return None

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password.

        Returns:
            User object if authentication successful, None otherwise
        """
        query = select(User).where(User.email == email)
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            return None

        if not AuthService.verify_password(password, user.hashed_password):
            return None

        return user

    @staticmethod
    async def create_user(db: AsyncSession, email: str, password: str) -> User:
        """
        Create a new user.

        Raises:
            ValueError: If user already exists
        """
        # Check if user exists
        query = select(User).where(User.email == email)
        result = await db.execute(query)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise ValueError("User with this email already exists")

        # Create new user
        hashed_password = AuthService.hash_password(password)
        user = User(email=email, hashed_password=hashed_password)

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return user

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        """Get a user by ID."""
        query = select(User).where(User.id == user_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Dependency to get the current authenticated user.

    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    user_id = AuthService.decode_token(token)

    if user_id is None:
        raise credentials_exception

    user = await AuthService.get_user_by_id(db, user_id)
    if user is None:
        raise credentials_exception

    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """
    Dependency to get the current user if authenticated, None otherwise.
    Used for endpoints that work with or without authentication.
    """
    if not credentials:
        return None

    try:
        token = credentials.credentials
        user_id = AuthService.decode_token(token)

        if user_id is None:
            return None

        user = await AuthService.get_user_by_id(db, user_id)
        return user
    except Exception:
        return None
