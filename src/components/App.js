import React from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Header from "./Header";
import LoginPage from "./LoginPage";
import AuthPage from "./AuthPage";
import ProfilePage from "./ProfilePage";
import PublicPage from "./PublicPage";
import ProtectedRoute from "./ProtectedRoute";
import { CLEAR_ALL } from "../util/actionTypes";

import "../css/App.css";

const App = ({ loggedIn, logout }) => (
  <Router>
    <Header loggedIn={loggedIn} logout={logout} />
    <div className="App-page">
      <Switch>
        <ProtectedRoute
          component={LoginPage}
          open={!loggedIn}
          path="/login"
          redirect="/profile"
        />
        <ProtectedRoute
          component={ProfilePage}
          open={loggedIn}
          path="/profile"
          redirect="/login"
        />
        <Route
          component={AuthPage}
          path="/auth"
        />
        <Route
          render={PublicPage}
          path="/home"
        />
        <Route path="/">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </div>
  </Router>
);

const mapStateToProps = state => ({
  loggedIn: !!state.token.accessToken
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: CLEAR_ALL })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
