import React from 'react';
import {Route, Switch} from 'react-router-dom';
import NotFound from '../../components/NotFound';
import AppliedRoute from '../../components/AppliedRoute';

import Dashboard from '../../containers/dashboard/Dashboard';

import Status from '../../containers/bookings/Status';
import NewBooking from '../../containers/bookings/New';
import BookingForm from '../../containers/bookings/BookingForm';

import Messages from '../../containers/account/Messages';
import Profile from '../../containers/account/Profile';
import Money from '../../containers/account/Money';

export default props => {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Dashboard} props={props} />

      <AppliedRoute path="/booking/new" exact component={NewBooking} props={props} />
      <AppliedRoute path="/booking/form/:contentType/:wordCount" exact component={BookingForm} props={props} />
      <AppliedRoute path="/booking/:status" exact component={Status} props={props} />

      <AppliedRoute path="/account/messages" exact component={Messages} props={props} />
      <AppliedRoute path="/account/profile" exact component={Profile} props={props} />
      <AppliedRoute path="/account/money" exact component={Money} props={props} />

      <Route path="/notfound" exact component={NotFound} />
      { /* Catch all unmatched routes */}
      <Route component={NotFound} />
    </Switch>
  )
}