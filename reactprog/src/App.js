import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage'; // page admin
import AllDevices from './AllDevices'; // page user
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
        <Route path="/register" component={RegisterPage} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />

        {/* Routes protégées */}
        <PrivateRoute path="/admin" component={AdminPage} allowedRoles={['admin']} />
        <PrivateRoute path="/home" component={AllDevices} allowedRoles={['user']} />
        <PrivateRoute path="/reservations" component={MyReservations} allowedRoles={['user']} />

        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
