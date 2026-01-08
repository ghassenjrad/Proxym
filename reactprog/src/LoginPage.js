// src/LoginPage.js
import React, { useState } from 'react';
import logoIMG from '../src/media/logo.svg';
import def from '../src/media/default.png';
import './LoginPage.css';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      if (response.data && response.data.access_token) {
        const { access_token } = response.data;

        // Decode JWT to get the role
        const decoded = jwtDecode(access_token);
        const role = decoded.role; // Assure-toi que ton payload contient role

        // Save token and role
        localStorage.setItem('token', access_token);
        localStorage.setItem('role', role);

        // Redirect based on role
        if (role === 'admin') {
          history.push('/admin'); // page d'administration
        } else {
          history.push('/home'); // page utilisateur normal
        }
      } else {
        console.error('No access_token found in response:', response.data);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Invalid email or password. Please try again.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };



  return (
    <div className='LoginPage'>
      <div className='ManeDiv'>
        <div className='LeftDiv'>
          <div className='Logo'>
            <a href="#">
              <img src={logoIMG} width="300px" alt="Logo" />
            </a>
          </div>
          <h1>Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="password-toggle"
              onClick={() => setPasswordVisible(!passwordVisible)}
            />
          </div>

          <div className="FormOptions">
            <Link className='ForgetPassword' to="/forgot-password">
              Forgot Password ?
            </Link>
            <Link className="SignUp" to="/register">
              Sign Up
            </Link>
          </div>
          {error && <p className="error-message">Invalid email or password. Please try again.</p>}
          <button onClick={handleLogin}>Login</button>
        </div>
        <div className='RightDiv'>
          <img src={def} alt="Default" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
