document.getElementById('recipe-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const ingredients = document.getElementById('ingredients').value;

    fetch('/generate-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'ingredients=' + encodeURIComponent(ingredients)
    })
    .then(response => response.json())
    .then(data => {
        const recipeResult = document.getElementById('recipe-result');
        const recipeContent = document.getElementById('recipe-content');
        recipeContent.innerHTML = `
            <h3>${data.title}</h3>
            <h4>Ingredients:</h4>
            <ul>
                ${data.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <h4>Instructions:</h4>
            <ol>
                ${data.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
        `;
        recipeResult.classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('submit-feedback').addEventListener('click', function() {
    const comment = document.getElementById('comment').value;
    // Simple logic to determine the rating. We can make this more robust later.
    const rating = document.querySelector('#thumb-up.selected') ? 'up' : (document.querySelector('#thumb-down.selected') ? 'down' : 'none');

    fetch('/submit-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: rating, comment: comment })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Feedback submitted:', data);
        alert('Thank you for your feedback!');
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('thumb-up').addEventListener('click', function() {
    this.classList.toggle('selected');
    document.getElementById('thumb-down').classList.remove('selected');
});

document.getElementById('thumb-down').addEventListener('click', function() {
    this.classList.toggle('selected');
    document.getElementById('thumb-up').classList.remove('selected');
});
