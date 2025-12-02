import logging
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-recipe', methods=['POST'])
def generate_recipe():
    ingredients = request.form.get('ingredients', '')
    # In the future, we will use an AI to generate the recipe.
    # For now, we'll return a mock recipe.
    mock_recipe = {
        'title': 'Mocktail Recipe',
        'ingredients': ingredients.splitlines(),
        'instructions': [
            'Mix all the ingredients together.',
            'Serve chilled.'
        ]
    }
    return jsonify(mock_recipe)

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    rating = data.get('rating')
    comment = data.get('comment')
    app.logger.info(f"Received feedback: Rating='{rating}', Comment='{comment}'")
    return jsonify({'status': 'success', 'message': 'Feedback received'})

if __name__ == '__main__':
    app.run(debug=True)
