// src/App.js
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './LoginPage';
import AllDevices from './AllDevices';
import MyReservations from './MyReservations';
import PrivateRoute from './PrivateRoute';
import RegisterPage from './RegisterPage';
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword';
import React from 'react';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path = "/register" component={RegisterPage}/>
        <Route path = "/forgot-password" component={ForgotPassword}/>
        <Route path = "/reset-Password" component={ResetPassword} />
        <PrivateRoute path="/home" component={AllDevices} />
        <PrivateRoute path="/reservations" component={MyReservations} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
