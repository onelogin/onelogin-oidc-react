import React from "react";
import { connect } from "react-redux";
import Loader from "react-loader";

import * as oidcApi from "../api/oidcApi";
import { generateStateAndNonce } from "../actions/tokenActions";

import "../css/LoginPage.css";

const LoginPage = ({ location, state, nonce, generateParams }) => {
  if (state === null || nonce === null) {
    generateParams();
  } else {
    // Set by ProtectedRoute when a page needed login first
    const from = location.state && location.state.from;
    const returnTo = from && `${from.pathname}${from.search}${from.hash}`;
    oidcApi.beginAuth({ state, nonce, returnTo });
  }

  return (
    <Loader />
  );
};

const mapStateToProps = state => ({
  state: state.token.state,
  nonce: state.token.nonce
});

const mapDispatchToProps = dispatch => ({
  generateParams: () => dispatch(generateStateAndNonce())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
