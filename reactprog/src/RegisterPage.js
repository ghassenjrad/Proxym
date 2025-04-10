// src/RegisterPage.js
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import logoIMG from '../src/media/logo.svg';
import './RegisterPage.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/register', { name, email, password });
      if (response.data) {
        alert('Registration successful. Please log in.');
        history.push('/login');
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
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleRegister}>Register</button>
        <Link className='Cancel' to="/login">Cancel</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
