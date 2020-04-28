import React from "react";
import { connect } from "react-redux";

import "../css/ProfilePage.css";

const ProfilePage = ({
  profile
}) => {
  const {
    email,
    fullname,
    username,
    company,
    dept,
    title
  } = profile;

  return (
    <div className="Profile-page">
      <h2>{username}'s ProfilePage</h2>
      <div className="Profile-data">
        <div className="Profile-section">
          <h3>Full Name</h3>
          <p>{fullname}</p>
        </div>

        <div className="Profile-section">
          <h3>Email Address</h3>
          <p>{email}</p>
        </div>

        <div className="Profile-section">
          <h3>Title</h3>
          <p>{title} in the {dept} department of {company}</p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps
)(ProfilePage);
