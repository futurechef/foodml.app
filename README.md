# FoodML Recipe Lab

An AI-powered recipe generation and verification platform where users prompt for custom recipes instead of searching, then crowdsource verification of how those AI-generated recipes perform in real kitchens.

## Features

- **AI Recipe Generation**: Natural language prompts powered by Claude AI
- **Detailed Recipes**: Precise measurements, timing, equipment, and chef tips
- **User Authentication**: Simple email/password authentication with JWT
- **Recipe Verification**: Star ratings, feedback, and success tracking
- **Favorites System**: Save and organize your favorite recipes
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Production-Ready**: Docker containerization for easy deployment

## Tech Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **PostgreSQL** - Robust relational database
- **SQLAlchemy** - Async ORM for database operations
- **Anthropic Claude API** - AI recipe generation
- **JWT** - Secure authentication

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Hook Form** - Form validation

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development orchestration
- **Google Cloud Run** - Production deployment target

## Project Structure

```
foodml-recipe-lab/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── config.py       # Configuration settings
│   │   ├── database.py     # Database connection
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # Business logic
│   │   └── schemas/        # Pydantic schemas
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Backend container
│   └── .env.example        # Environment variables template
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── components/    # React components
│   │   ├── lib/           # API client and types
│   │   └── styles/        # Global styles
│   ├── package.json       # Node dependencies
│   ├── Dockerfile         # Frontend container
│   └── .env.local.example # Frontend environment template
│
├── docker-compose.yml     # Local development setup
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended for easiest setup)
- **Anthropic API Key** - Get one at [https://console.anthropic.com/](https://console.anthropic.com/)

OR for local development:
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   cd foodml-recipe-lab
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` and add your Anthropic API key**
   ```
   ANTHROPIC_API_KEY=sk-ant-your-api-key-here
   JWT_SECRET_KEY=your-secret-key-here
   ```

4. **Start all services**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database URL and Anthropic API key

5. **Start the backend**
   ```bash
   python -m app.main
   ```
   Backend will run on [http://localhost:8000](http://localhost:8000)

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Generating Recipes

1. **Sign up** for a new account or **login**
2. Click **"Generate Recipe"** or navigate to `/generate`
3. Describe what you want to cook:
   - "Easy weeknight pasta with pantry staples"
   - "Healthy vegetarian lunch bowl"
   - "Quick chocolate dessert for beginners"
4. Optionally set:
   - Number of servings
   - Cuisine type
   - Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
5. Click **"Generate Recipe"** and wait 5-10 seconds
6. View your detailed recipe with ingredients, instructions, and tips

### Verifying Recipes

1. After cooking a recipe, scroll to the **"Have you tried this recipe?"** section
2. Rate the recipe (1-5 stars)
3. Indicate if it worked well
4. Share actual cooking time and feedback
5. Submit to help others!

### Managing Recipes

- **My Recipes**: View all recipes you've generated
- **Favorites**: Click the heart icon to save favorites
- **Recipe Details**: Click any recipe card to view full details

## API Documentation

Once the backend is running, visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API documentation.

### Key Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/recipes/generate` - Generate recipe with AI
- `GET /api/recipes/{id}` - Get recipe by ID
- `GET /api/recipes/` - Get user's recipes
- `POST /api/recipes/{id}/favorite` - Toggle favorite
- `POST /api/verifications/` - Submit recipe verification
- `GET /api/verifications/recipe/{id}` - Get recipe verifications

## Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ANTHROPIC_API_KEY` | Claude API key | Yes | - |
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql+asyncpg://...` |
| `JWT_SECRET_KEY` | Secret for JWT tokens | Yes | - |
| `JWT_ALGORITHM` | JWT algorithm | No | `HS256` |
| `ENVIRONMENT` | Environment name | No | `development` |
| `DEBUG` | Enable debug mode | No | `True` |

### Frontend (.env.local)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `http://localhost:8000` |

## Database Models

### User
- Email/password authentication
- Relationships to recipes and verifications

### Recipe
- AI-generated recipe data
- Ingredients (JSON array)
- Instructions (JSON array)
- Metadata: timing, difficulty, cuisine, dietary tags
- Verification statistics

### Verification
- User feedback on recipes
- Rating (1-5 stars)
- Success boolean
- Execution time
- Feedback text

### Favorite
- User-recipe relationship for saved recipes

## Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend
pytest

# Frontend tests (when implemented)
cd frontend
npm test
```

### Code Quality
```bash
# Backend linting
cd backend
black app/
flake8 app/

# Frontend linting
cd frontend
npm run lint
```

### Database Migrations

The application automatically creates tables on startup. For production, consider using Alembic for migrations:

```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Deployment

### Google Cloud Run

1. **Build and push containers**
   ```bash
   # Backend
   docker build -t gcr.io/YOUR-PROJECT/foodml-backend ./backend
   docker push gcr.io/YOUR-PROJECT/foodml-backend

   # Frontend
   docker build -t gcr.io/YOUR-PROJECT/foodml-frontend ./frontend
   docker push gcr.io/YOUR-PROJECT/foodml-frontend
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy foodml-backend \
     --image gcr.io/YOUR-PROJECT/foodml-backend \
     --platform managed \
     --region us-central1 \
     --set-env-vars ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY

   gcloud run deploy foodml-frontend \
     --image gcr.io/YOUR-PROJECT/foodml-frontend \
     --platform managed \
     --region us-central1
   ```

3. **Set up Cloud SQL** for production database

## Troubleshooting

### Common Issues

**"Failed to generate recipe"**
- Check that `ANTHROPIC_API_KEY` is set correctly
- Verify you have API credits
- Check backend logs: `docker-compose logs backend`

**Database connection errors**
- Ensure PostgreSQL is running: `docker-compose ps`
- Check `DATABASE_URL` is correct
- Wait for database to be ready (healthcheck in docker-compose)

**Frontend can't connect to backend**
- Verify `NEXT_PUBLIC_API_URL` points to backend
- Check CORS settings in backend `config.py`
- Ensure backend is running on port 8000

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## Security Notes

- Change `JWT_SECRET_KEY` in production (use `openssl rand -hex 32`)
- Use HTTPS in production
- Keep `ANTHROPIC_API_KEY` secret
- Review CORS settings for production domains
- Consider rate limiting for API endpoints

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Check API documentation at `/docs`
- Review logs for error details

## Roadmap

- [ ] Recipe search and filtering
- [ ] Social features (sharing, comments)
- [ ] Recipe modifications tracking
- [ ] Nutrition calculation integration
- [ ] Image upload for dish photos
- [ ] Email notifications
- [ ] Recipe collections/cookbooks
- [ ] Advanced AI features (ingredient substitutions, scaling)

---

Built with Claude AI by Anthropic
