import { stringify } from "query-string";

// Static oidc params for a single provider
const authority = "https://openid-connect.onelogin.com/oidc";
const client_id = "ENTER YOUR CLIENT ID HERE";
const redirect_uri = "http://localhost:3000/auth";
const response_type = "id_token token";
const scope = "openid profile";

export const beginAuth = ({ state, nonce }) => {
  // Generate authentication URL
  const params = stringify({
    client_id,
    redirect_uri,
    response_type,
    scope,
    state,
    nonce
  });
  const authUrl = `${authority}/auth?${params}`;
  console.log(authUrl);

  // Attempt login by navigating to authUrl
  window.location.assign(authUrl);
};
