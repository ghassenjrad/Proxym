import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './ResetPassword.css';
import logoIMG from '../src/media/logo.svg';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState(new URLSearchParams(window.location.search).get('token'));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/auth/reset-password', {
        token,
        newPassword,
      });
      setSuccess(response.data.message);
      setTimeout(() => history.push('/login'), 2000); // Redirect after a short delay
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleCancel = () => {
    history.push('/login'); // Redirect to login page
  };

  return (
    <div className="ResetPassword">
      <div className="FormContainer">
        <div className="Logo">
          <img src={logoIMG} alt="Company Logo" />
        </div>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label>
            New Password:
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </label>
          <label>
            Confirm Password:
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </label>
          <div className="ButtonGroup">
            <button type="submit">Confirm</button>
            <button type="button" className="cancel" onClick={handleCancel}>Cancel</button>
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
