import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './ForgotPassword.css';
import logoIMG from '../src/media/logo.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
      setSuccess(response.data.message);
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      setSuccess('');
    }
  };

  const handleCancel = () => {
    history.push('/login'); 
  };

  return (
    <div className="ForgotPassword">
      <div className="FormContainer">
        <div className="Logo">
          <img src={logoIMG} alt="Company Logo" />
        </div>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </label>
          <button type="submit">Send Reset Link</button>
          <button className='Cancelbutoon' onClick={handleCancel}>Cancel</button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
