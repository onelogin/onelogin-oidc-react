import React from "react";

import "../css/PublicPage.css";

const PublicPage = () => (
  <div className="Profile-page">
    <h3>This public page is always accessible</h3>
    <p>This page can always be accessed as it's not protected by authentication status</p>
  </div>
);

export default PublicPage;
