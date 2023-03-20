from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = "mongodb://requerty:BlackMamba24@localhost:27017/todo_app_db"
mongo = PyMongo(app)

todos_collection = mongo.db.todos

@app.route('/todos', methods=['GET'])
def get_todos():
    todos = []
    for todo in todos_collection.find():
        todos.append({'_id': str(todo['_id']), 'title': todo['title'], 'completed': todo['completed']})
    return jsonify(todos)

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    new_todo = {'title': data['title'], 'completed': data['completed']}
    result = todos_collection.insert_one(new_todo)
    return jsonify({'_id': str(result.inserted_id), 'title': data['title'], 'completed': data['completed']})

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
