// src/RegisterPage.js
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import logoIMG from '../src/media/logo.svg';
import { jwtDecode } from 'jwt-decode';
import './RegisterPage.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const isCurrentAdmin = localStorage.getItem('role') === 'admin' || localStorage.getItem('token') && (() => { try { return (jwtDecode(localStorage.getItem('token')).role === 'admin'); } catch { return false } })();
  const [createAsAdmin, setCreateAsAdmin] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isCurrentAdmin && createAsAdmin) {
        // Admin creating a user with a role
        response = await axios.post('http://localhost:3000/users/create-with-role', { name, email, password, role: 'admin' }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        response = await axios.post('http://localhost:3000/users/register', { name, email, password });
      }
      if (response.data) {
        alert('Registration successful.');
        // If admin created a user, stay on register page; else redirect to login
        if (!isCurrentAdmin) history.push('/login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className='RegisterPage'>
      <div className='FormContainer'>
        <div className='Logo'>
          <img src={logoIMG} width="200px" alt="Company Logo" />
        </div>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isCurrentAdmin && (
          <div style={{ marginTop: 8 }}>
            <label>
              <input type="checkbox" checked={createAsAdmin} onChange={(e) => setCreateAsAdmin(e.target.checked)} />
              Create as Admin
            </label>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleRegister}>Register</button>
        <Link className='Cancel' to="/login">Cancel</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
