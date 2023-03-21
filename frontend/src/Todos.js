import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post('http://backend:5001/login', {
        username: username,
        password: password,
      });
      localStorage.setItem('user_id', response.data.user_id);
    } catch (error) {
      if (error.response.status === 401) {
        console.log(error.response.data.message);
      } else {
        console.log(error);
      }
    }
  };  

  const fetchTodos = async () => {
    const userId = localStorage.getItem('user_id');
    const response = await axios.get(`http://backend:5001/todos?user_id=${userId}`);
    setTodos(response.data);
  };

  const addTodo = async () => {
  if (inputValue.trim() !== '') {
    const userId = localStorage.getItem('user_id');
    const newTodo = {
      title: inputValue,
      completed: false,
      user_id: userId,
    };
    await axios.post(`http://backend:5001/todos`, newTodo);
    setInputValue('');
    fetchTodos();
  }
};

  const updateTodo = async (id, completed) => {
    await axios.put(`http://backend:5001/todos/${id}`, { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://backend:5001/todos/${id}`);
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

export default Todos;

