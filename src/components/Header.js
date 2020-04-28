import React from "react";
import {
  Link,
  NavLink
} from "react-router-dom";

import "../css/Header.css";

const Header = ({ loggedIn, logout }) => (
  <div className="App-header">
    <header className="App-banner">
      <h2>Oidc React Client</h2>
      <h4>Implicit flow demonstration</h4>
    </header>
    <div className="Header-links">
      {loggedIn
        ? (<LoggedInNav logout={logout} />)
        : (<LoggedOutNav />)
      }
    </div>
  </div>
);

const LoggedInNav = ({ logout }) => (
  <>
    <NavLink to="/home">Home</NavLink>
    <NavLink to="/profile">Profile</NavLink>
    <Link to="/home" onClick={logout}>Logout</Link>
  </>
)

const LoggedOutNav = () => (
  <>
    <NavLink to="/home">Home</NavLink>
    <NavLink to="/login">Login</NavLink>
  </>
);

export default Header;
