document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.querySelector('main');
    const messageInput = document.querySelector('input[placeholder="Ask for a recipe..."]');
    const sendButton = document.getElementById('send-btn');

    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeSignupModal = document.getElementById('close-signup-modal');

    loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    signupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));
    closeLoginModal.addEventListener('click', () => loginModal.classList.add('hidden'));
    closeSignupModal.addEventListener('click', () => signupModal.classList.add('hidden'));

    const signupForm = signupModal.querySelector('button.w-full');
    signupForm.addEventListener('click', async () => {
        const email = signupModal.querySelector('input[type="email"]').value;
        const password = signupModal.querySelector('input[type="password"]').value;
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.status === 'success') {
            signupModal.classList.add('hidden');
        } else {
            alert(data.message);
        }
    });

    const loginForm = document.getElementById('login-submit-btn');
    loginForm.addEventListener('click', async () => {
        const email = loginModal.querySelector('input[type="email"]').value;
        const password = loginModal.querySelector('input[type="password"]').value;
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.status === 'success') {
            localStorage.setItem('token', data.token);
            loginModal.classList.add('hidden');
        } else {
            alert(data.message);
        }
    });

    sendButton.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        if (message) {
            appendMessage('You', message);
            messageInput.value = '';

            const response = await fetch('/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            appendRecipe(data.recipe);
        }
    });

    function appendMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.className = `flex items-end gap-3 ${sender === 'You' ? 'justify-end' : ''}`;
        messageElement.innerHTML = `
            <div class="flex flex-1 flex-col gap-1 items-${sender === 'You' ? 'end' : 'start'}">
                <p class="text-[var(--text-secondary)] text-xs font-medium">${sender}</p>
                <div class="${sender === 'You' ? 'bg-[var(--primary-color)] text-[var(--background-color)]' : 'bg-[#29382f] text-white'} p-3 rounded-2xl ${sender === 'You' ? 'rounded-br-lg' : 'rounded-bl-lg'}">
                    <p class="text-base leading-relaxed">${text}</p>
                </div>
            </div>
        `;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function appendRecipe(recipe) {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'bg-[#29382f] rounded-2xl overflow-hidden shadow-lg';
        recipeElement.innerHTML = `
            <div class="bg-center bg-no-repeat aspect-video bg-cover" style='background-image: url("${recipe.image_url}");'></div>
            <div class="p-4">
                <h3 class="text-white text-lg font-bold">${recipe.name}</h3>
                <p class="text-[var(--text-secondary)] text-sm mt-1">${recipe.description}</p>
                <button class="save-recipe-btn mt-4 bg-[var(--primary-color)] text-[var(--background-color)] font-bold py-2 px-4 rounded-full hover:bg-opacity-90" data-recipe='${JSON.stringify(recipe)}'>Save Recipe</button>
            </div>
        `;
        chatHistory.appendChild(recipeElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        const saveButton = recipeElement.querySelector('.save-recipe-btn');
        saveButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const recipeData = JSON.parse(saveButton.dataset.recipe);
                await fetch('/save_recipe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, recipe: recipeData })
                });
            } else {
                alert('Please login to save recipes.');
            }
        });
    }
});
