import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://192.168.31.222:5001/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        title: inputValue,
        completed: false,
      };
      await axios.post('http://192.168.31.222:5001/todos', newTodo);
      setInputValue('');
      fetchTodos();
    }
  };

  const updateTodo = async (id, completed) => {
    await axios.put('http://192.168.31.222:5001/todos/${id}', { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete('http://192.168.31.222:5001/todos/${id}');
    fetchTodos();
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">Todo App</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a new todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" onClick={addTodo}>
            Add Todo
          </button>
        </div>
      </div>
      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <input
                type="checkbox"
                className="mr-2"
                checked={todo.completed}
                onChange={() => updateTodo(todo._id, todo.completed)}
              />
              {todo.title}
            </div>
            <button className="btn btn-danger" onClick={() => deleteTodo(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
