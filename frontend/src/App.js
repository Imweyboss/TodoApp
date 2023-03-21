import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Todos from './Todos';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Auth isLogin={false} />} />
        <Route path="/login" element={<Auth isLogin={true} />} />
        <Route path="/todos" element={localStorage.getItem('user_id') ? <Todos /> : <Navigate to="/login" />} />
        <Route index path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
