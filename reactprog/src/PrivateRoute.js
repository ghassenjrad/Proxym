// src/PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // au lieu de import jwtDecode from 'jwt-decode';

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const token = localStorage.getItem('token');
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role; // Assure-toi que le token contient bien le champ 'role'
    } catch (err) {
      console.error('Invalid token', err);
    }
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        token && allowedRoles.includes(userRole) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
