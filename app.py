from flask import Flask, render_template, request, jsonify
import random
import uuid

app = Flask(__name__)

# Mock database
users = {}
recipes = {
    "123": {
        "id": "123",
        "name": "Spicy Thai Peanut Noodles",
        "description": "A vibrant and flavorful dish featuring rice noodles tossed in a creamy peanut sauce with a kick of spice, perfect for a quick and satisfying meal.",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCms5AtMPE6Jn79OW6VZQTFXi3czzq9S6sDaOPfCvOdzzrsYT23lSdh8LcR0mx8WdW019Qbd3nB6LsO57i0k9iOCAonysVIqzJX_woo0gNKGL4iLMc_6sqHNJ13wzr6IbI3Ff_6N2w9D3eBBQK7kfz93MLMH2ZPrCzbvWb3Y0suVflSoPv_-JRk5Q2THe47_F8YJrJBEzTAfUtCtiscMgOrTVktVL4eiS552JCw4mCWWOiV7330zA42VgXaH2UulFbsldZ9ksnd05cK"
    },
    "456": {
        "id": "456",
        "name": "Vegetarian Chili",
        "description": "Hearty and flavorful chili packed with beans and vegetables.",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ-nkxD_D_NBaa8Wzzd0u4Rd0BM8Bkuy5tOhy_g4E-y5Enq2Pi9zKmTEldVcYwykoJQc6Bu3awV7upMV159JlcOjVNCkur4w093XZDXsyhEvqveHJGvKbEORfREE_1gdHIDucdm9MYcIZRhSTjVP-GAT9ppPpSt9ooZYVhNIlxtEFJpSTcDvoukrfB9d5ZShT4CK7KvLcYoI20z_p--ZfSlEyWdc6b73TnTpyApWeX-3CM3vaH_CDm9J4M-EqGfgJfiUl3WJLtvjsH"
    },
    "789": {
        "id": "789",
        "name": "Mushroom Risotto",
        "description": "Creamy and rich risotto with a variety of mushrooms.",
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDIMzGAgi0oKi6oHsAnArbs9PuUzNwJj_14IOPPMMt1aupIhQHao2l-QLrFojh1Z_93BHCjmdsyx0LrSvDyODtfbArhLgxsWXO01Cn5IeUSncS_ROaA7tAy_jRZC3fD1-ZmgwHvY4oLUK-CxRc1gtvKS07QQfw4mz5sI68Qn1yRkJEMSfuOkTbdUcYvYQMuGbl1AZYSnggLQOczhoErfVCzTE8JPQCj9WjdJrcgRFPg3TIR3nlzCnAOxYNN-OLJhjj_Pbxj_sbzpmyu"
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recipe')
def recipe():
    return render_template('recipe.html')

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    message = data.get('message', '').lower()

    if "vegetarian" in message:
        response_recipe = recipes["456"]
    elif "mushroom" in message:
        response_recipe = recipes["789"]
    else:
        response_recipe = recipes["123"]

    return jsonify(recipe=response_recipe)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if email in users:
        return jsonify(status="error", message="User already exists")
    users[email] = {"password": password, "recipes": []}
    return jsonify(status="success", message="User created successfully")

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if email in users and users[email]['password'] == password:
        token = str(uuid.uuid4())
        users[email]['token'] = token
        return jsonify(status="success", token=token)
    return jsonify(status="error", message="Invalid credentials")

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify(status="success")

@app.route('/save_recipe', methods=['POST'])
def save_recipe():
    data = request.get_json()
    token = data.get('token')
    recipe_data = data.get('recipe')

    user_email = None
    for email, user_data in users.items():
        if user_data.get('token') == token:
            user_email = email
            break

    if user_email:
        recipe_id = recipe_data['id']
        recipes[recipe_id] = recipe_data
        users[user_email]['recipes'].append(recipe_id)
        return jsonify(status="success", message="Recipe saved")
    return jsonify(status="error", message="Unauthorized")

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/get_saved_recipes', methods=['POST'])
def get_saved_recipes():
    data = request.get_json()
    token = data.get('token')

    user_email = None
    for email, user_data in users.items():
        if user_data.get('token') == token:
            user_email = email
            break

    if user_email:
        saved_recipe_ids = users[user_email]['recipes']
        saved_recipes = [recipes[recipe_id] for recipe_id in saved_recipe_ids]
        return jsonify(status="success", recipes=saved_recipes)
    return jsonify(status="error", message="Unauthorized")

@app.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    token = data.get('token')
    recipe_id = data.get('recipe_id')
    comment_text = data.get('comment')

    user_email = None
    for email, user_data in users.items():
        if user_data.get('token') == token:
            user_email = email
            break

    if user_email:
        if recipe_id in recipes:
            if 'comments' not in recipes[recipe_id]:
                recipes[recipe_id]['comments'] = []
            recipes[recipe_id]['comments'].append({"user": user_email, "text": comment_text})
            return jsonify(status="success", message="Comment added")
        return jsonify(status="error", message="Recipe not found")
    return jsonify(status="error", message="Unauthorized")

@app.route('/get_recipe_details')
def get_recipe_details():
    recipe_id = request.args.get('id')
    if recipe_id in recipes:
        return jsonify(status="success", recipe=recipes[recipe_id])
    return jsonify(status="error", message="Recipe not found")

@app.route('/get_user_by_token', methods=['POST'])
def get_user_by_token():
    data = request.get_json()
    token = data.get('token')
    for email, user_data in users.items():
        if user_data.get('token') == token:
            return jsonify(status="success", email=email)
    return jsonify(status="error", message="User not found")

if __name__ == '__main__':
    app.run(debug=True)
