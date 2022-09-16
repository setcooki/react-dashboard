import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {authentication} from '../services/authentication';

export const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => {
    const currentUser = authentication.currentUserValue;
    if (!currentUser) {
      // not logged in so redirect to login page with the return url
      return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
    }

    // authorised so return components
    return <Component {...props} />
  }}/>
)
