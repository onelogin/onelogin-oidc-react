import jwtDecode from "jwt-decode";

// Static oidc params for a single provider
const authority = "https://<ONELOGIN SUBDOMAIN>.onelogin.com/oidc/2";
const client_id = "ENTER YOUR CLIENT ID HERE";
const redirect_uri = "http://localhost:3000/auth";
const response_type = "id_token token";
const scope = "openid profile";

// The redux store doesn't survive the trip to OneLogin and back, so what we
// need to check the response is kept in sessionStorage until it arrives
export const pendingAuthKey = "oidc-pending-auth";

export const beginAuth = ({ state, nonce, returnTo }) => {
  sessionStorage.setItem(
    pendingAuthKey,
    JSON.stringify({ state, nonce, returnTo })
  );

  // Generate authentication URL
  const params = new URLSearchParams({
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

export const completeAuth = hash => {
  const pending = JSON.parse(sessionStorage.getItem(pendingAuthKey));
  // OneLogin returns the result in the fragment: #id_token=...&access_token=...&state=...
  const response = new URLSearchParams(hash.replace(/^#/, ""));

  // Reject a response to a login this tab didn't start (CSRF). It leaves the
  // pending login alone, so the real response can still complete it
  if (!pending || response.get("state") !== pending.state) {
    throw new Error("Login failed: state does not match");
  }
  // A response can only be used once
  sessionStorage.removeItem(pendingAuthKey);

  if (response.has("error")) {
    throw new Error(
      response.get("error_description") || response.get("error")
    );
  }
  const idToken = response.get("id_token");
  // Decoded, not verified: enough to show the profile, but anything that
  // trusts the user's identity must verify the token's signature first
  const profile = jwtDecode(idToken);
  // Reject an id_token issued for a different login (replay)
  if (profile.nonce !== pending.nonce) {
    throw new Error("Login failed: nonce does not match");
  }

  return {
    accessToken: response.get("access_token"),
    idToken,
    profile,
    returnTo: pending.returnTo
  };
};
