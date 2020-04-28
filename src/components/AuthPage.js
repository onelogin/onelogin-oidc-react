import React from "react";
import { connect } from "react-redux";
import {
  Redirect
} from "react-router-dom";
import { parse } from "query-string";
import jwtDecode from "jwt-decode";
import isEmpty from "lodash/isEmpty";
import Loader from "react-loader";

import { receiveAccessToken, receiveIdToken } from "../actions/tokenActions";
import { receiveProfileData } from "../actions/profileActions";

const AuthPage = ({
  location,
  profile,
  receiveProfile,
  receiveTokens
}) => {
  if (isEmpty(profile)) {
    const hash = location.hash;
    const response = parse(hash);
    if (response.error) {
      alert(response.error_description);
      return <Redirect to="/home" />
    } else {
      receiveTokens(response.access_token, response.idToken);
      receiveProfile(jwtDecode(response.id_token));
    }
    // Render loader
    return <Loader />;
  } else {
    return <Redirect to="/profile" />
  }
};

const mapStateToProps = state => ({
  profile: state.profile,
  state: state.token.state,
  nonce: state.token.nonce
});

const mapDispatchToProps = dispatch => ({
  receiveProfile: data => dispatch(receiveProfileData(data)),
  receiveTokens: (accessToken, idToken) => {
    dispatch(receiveAccessToken(accessToken));
    dispatch(receiveIdToken(idToken));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage);
