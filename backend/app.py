from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import os

load_dotenv()
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
host = 'mongo'
port = 27017
username = os.environ['MONGO_USERNAME']
password = os.environ['MONGO_PASSWORD']
database = 'todo_app'

client = MongoClient(host=host, port=port, username=username, password=password)

todos_collection = client[database].todos
users_collection = client[database].users


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    existing_user = users_collection.find_one({'email': data['email']})

    if existing_user:
        return jsonify({'message': 'User with this email already exists.'}), 409

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = {
        'username': data['username'],
        'email': data['email'],
        'password': hashed_password,
    }

    result = users_collection.insert_one(new_user)
    return jsonify({'_id': str(result.inserted_id), 'username': data['username'], 'email': data['email']}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({'username': data['username']})
    if not user:
        return jsonify({'message': 'Username not found.'}), 401
    if not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Incorrect username or password.'}), 401
    else:
        return jsonify({'user_id': str(user['_id'])})



@app.route('/users', methods=['GET'])
def get_users():
    users = []

    for user in users_collection.find():
        users.append({'_id': str(user['_id']), 'username': user['username'], 'email': user['email']})

    return jsonify(users)

@app.route('/todos', methods=['GET'])
def get_todos():
    user_id = request.args.get('user_id')

    if user_id:
        todos = [{'_id': str(todo['_id']), 'title': todo['title'], 'completed': todo['completed']} for todo in todos_collection.find({'user_id': user_id})]

    else:
        todos = [{'_id': str(todo['_id']), 'title': todo['title'], 'completed': todo['completed']} for todo in todos_collection.find()]

    return jsonify(todos)


@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    new_todo = {'title': data['title'], 'completed': data['completed'], 'user_id': data['user_id']}
    result = todos_collection.insert_one(new_todo)

    return jsonify({'_id': str(result.inserted_id), 'title': data['title'], 'completed': data['completed'], 'user_id': data['user_id']})


@app.route('/todos/<id>', methods=['PUT'])
def update_todo(id):
    data = request.get_json()
    todos_collection.update_one({'_id': ObjectId(id)}, {'$set': {'completed': data['completed']}})

    return jsonify({'_id': id, 'completed': data['completed']})


@app.route('/todos/<id>', methods=['DELETE'])
def delete_todo(id):
    todos_collection.delete_one({'_id': ObjectId(id)})

    return jsonify({'_id': id})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

