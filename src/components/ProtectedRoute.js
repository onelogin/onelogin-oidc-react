import React from "react";
import {
  Route,
  Redirect
} from "react-router-dom";

/**
 * ProtectedRoute locks a route unless the open prop is true
 * 
 * @param {Bool} open - if true, renders `compenent` prop. If false, redirects to `redirect` location
 * @param {Component} component - Component to render when accessible
 * @param {String} redirect - path to redirect to when inaccessible
 *
 * The redirect passes the requested location as `state.from`, so LoginPage
 * can send the user back to it after login
 */
const ProtectedRoute = ({ open, component: Component, redirect, ...rest }) => (
  <Route {...rest} render={routeProps => (
    open
      ? (<Component {...routeProps} />)
      : (<Redirect to={{
          pathname: redirect,
          state: { from: routeProps.location }
        }} />)
  )} />
);

export default ProtectedRoute;
