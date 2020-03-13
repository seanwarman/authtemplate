import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../../components/NotFound';

import AppliedRoute from '../../components/AppliedRoute';
import ResetPassword from '../../containers/auth/ResetPassword';
import Login from '../../containers/auth/Login';

export default (props) => {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Login} props={props} />
      <Route path="/reset/:resetKey" exact component={ResetPassword} props={props} />
      <Route component={NotFound} />
    </Switch>
  )
}