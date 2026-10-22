import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Redirect
} from "react-router-dom";
import Loader from "react-loader";

import * as oidcApi from "../api/oidcApi";
import { receiveAccessToken, receiveIdToken } from "../actions/tokenActions";
import { receiveProfileData } from "../actions/profileActions";

const AuthPage = ({
  location,
  receiveProfile,
  receiveTokens
}) => {
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    try {
      const {
        accessToken,
        idToken,
        profile,
        returnTo
      } = oidcApi.completeAuth(location.hash);
      receiveTokens(accessToken, idToken);
      receiveProfile(profile);
      // Go back to the page that sent us to login, if there was one
      setRedirect(returnTo || "/profile");
    } catch (error) {
      alert(error.message);
      setRedirect("/home");
    }
  }, [location.hash, receiveProfile, receiveTokens]);

  // Render loader until the response has been checked
  return redirect ? <Redirect to={redirect} /> : <Loader />;
};

const mapDispatchToProps = dispatch => ({
  receiveProfile: data => dispatch(receiveProfileData(data)),
  receiveTokens: (accessToken, idToken) => {
    dispatch(receiveAccessToken(accessToken));
    dispatch(receiveIdToken(idToken));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(AuthPage);
