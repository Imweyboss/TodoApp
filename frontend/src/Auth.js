import React, { useState } from 'react';
import { useNavigate, Routes, Redirect } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Auth = ({ isLogin }) => {
  const [authData, setAuthData] = useState({ username: "", email: "", password: "" });
  const history = useNavigate();

  const authUser = async () => {
    if (!authData.username || !authData.password || (!isLogin && !authData.email)) {
      console.error("Please fill in all the fields.");
      return;
    }
  
    const payload = {
      username: authData.username,
      password: authData.password,
    };
  
    if (!isLogin) {
      payload.email = authData.email;
    }
  
    try {
      const response = await axios.post(`/api/${isLogin ? 'login' : 'register'}`, payload);
      localStorage.setItem('user_id', response.data._id);
      history('/todos');
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Registration'} error:`, error.response?.data?.message || error.message);
    }
  };
  

  return (
    <div className="auth-form mb-5">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="form-control"
          id="username"
          value={authData.username}
          onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
        />
      </div>
      {!isLogin && (
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={authData.email}
            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={authData.password}
          onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
        />
      </div>
      <button className="btn btn-primary" onClick={authUser}>
        {isLogin ? 'Login' : 'Register'}
      </button>
    </div>
  );
};

export default Auth;
