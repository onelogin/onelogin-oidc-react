import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import Root from "./Root";
import store from "../reducers/_store";
import { pendingAuthKey } from "../api/oidcApi";
import { CLEAR_ALL } from "../util/actionTypes";

// jsdom can't navigate to OneLogin, so swap in a location the router can read
// and that records where beginAuth sends the browser
const setLocation = url => {
  const { pathname, search, hash } = new URL(url, "http://localhost");
  delete window.location;
  window.location = { pathname, search, hash, assign: jest.fn() };
};

const base64Url = value =>
  btoa(JSON.stringify(value))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

// The sample decodes the id_token without checking its signature
const idToken = claims =>
  `${base64Url({ alg: "RS256" })}.${base64Url(claims)}.signature`;

const profileClaims = {
  preferred_username: "jdoe",
  name: "Jane Doe",
  email: "jdoe@example.com"
};

let container;

const renderApp = url => {
  setLocation(url);
  act(() => {
    ReactDOM.render(<Root />, container);
  });
};

// Where the router last redirected to
const redirectedTo = () => {
  const { calls } = window.history.replaceState.mock;
  return calls.length ? calls[calls.length - 1][2] : null;
};

// What the browser would load after OneLogin redirects back
const returnFromOneLogin = params => {
  ReactDOM.unmountComponentAtNode(container);
  store.dispatch({ type: CLEAR_ALL });
  renderApp(`/auth#${new URLSearchParams(params)}`);
};

// Starts a login at url and returns the state and nonce sent to OneLogin
const startLogin = url => {
  renderApp(url);
  const [authUrl] = window.location.assign.mock.calls[0];
  // authority is still a placeholder, so this can't be parsed with URL
  const params = new URLSearchParams(authUrl.split("?")[1]);
  return { state: params.get("state"), nonce: params.get("nonce") };
};

beforeEach(() => {
  container = document.createElement("div");
  sessionStorage.clear();
  store.dispatch({ type: CLEAR_ALL });
  jest.spyOn(window.history, "replaceState");
  jest.spyOn(window, "alert").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container);
  jest.restoreAllMocks();
});

it("sends a deep link to login and remembers it", () => {
  const { state, nonce } = startLogin("/profile?tab=1#top");

  expect(redirectedTo()).toBe("/login");
  expect(state).toMatch(/^[\w-]{32}$/);
  expect(nonce).toMatch(/^[\w-]{32}$/);
  expect(JSON.parse(sessionStorage.getItem(pendingAuthKey))).toEqual({
    state,
    nonce,
    returnTo: "/profile?tab=1#top"
  });
});

it("returns to the deep link after login", () => {
  const { state, nonce } = startLogin("/profile?tab=1#top");

  returnFromOneLogin({
    access_token: "access-token",
    id_token: idToken({ ...profileClaims, nonce }),
    state
  });

  expect(window.alert).not.toHaveBeenCalled();
  expect(redirectedTo()).toBe("/profile?tab=1#top");
  expect(container.textContent).toContain("jdoe's ProfilePage");
  expect(store.getState().token).toMatchObject({
    accessToken: "access-token",
    idToken: idToken({ ...profileClaims, nonce })
  });
});

it("goes to the profile page after a login without a deep link", () => {
  const { state, nonce } = startLogin("/login");

  returnFromOneLogin({
    access_token: "access-token",
    id_token: idToken({ ...profileClaims, nonce }),
    state
  });

  expect(redirectedTo()).toBe("/profile");
  expect(container.textContent).toContain("jdoe's ProfilePage");
});

it("uses a response only once", () => {
  const { state, nonce } = startLogin("/login");
  const response = {
    access_token: "access-token",
    id_token: idToken({ ...profileClaims, nonce }),
    state
  };

  returnFromOneLogin(response);
  expect(sessionStorage.getItem(pendingAuthKey)).toBeNull();

  returnFromOneLogin(response);
  expect(window.alert).toHaveBeenCalledWith(
    "Login failed: state does not match"
  );
  expect(redirectedTo()).toBe("/home");
  expect(store.getState().token.accessToken).toBeNull();
});

it("rejects a response with a different state", () => {
  const { nonce } = startLogin("/profile");

  returnFromOneLogin({
    access_token: "access-token",
    id_token: idToken({ ...profileClaims, nonce }),
    state: "someone-elses-state"
  });

  expect(window.alert).toHaveBeenCalledWith(
    "Login failed: state does not match"
  );
  expect(redirectedTo()).toBe("/home");
  expect(store.getState().token.accessToken).toBeNull();
  expect(store.getState().profile).toBeNull();
});

it("keeps the login going after a response with a different state", () => {
  const { state, nonce } = startLogin("/profile?tab=1#top");

  returnFromOneLogin({ error: "access_denied", state: "someone-elses-state" });
  expect(window.alert).toHaveBeenCalledWith(
    "Login failed: state does not match"
  );

  returnFromOneLogin({
    access_token: "access-token",
    id_token: idToken({ ...profileClaims, nonce }),
    state
  });
  expect(redirectedTo()).toBe("/profile?tab=1#top");
  expect(container.textContent).toContain("jdoe's ProfilePage");
});

it("rejects an id_token issued for a different login", () => {
  const { state } = startLogin("/profile");

  returnFromOneLogin({
    access_token: "access-token",
    id_token: idToken({ ...profileClaims, nonce: "another-nonce" }),
    state
  });

  expect(window.alert).toHaveBeenCalledWith(
    "Login failed: nonce does not match"
  );
  expect(redirectedTo()).toBe("/home");
  expect(store.getState().token.accessToken).toBeNull();
});

it("shows the error OneLogin returns", () => {
  const { state } = startLogin("/profile");

  returnFromOneLogin({
    error: "access_denied",
    error_description: "User is not assigned to this app",
    state
  });

  expect(window.alert).toHaveBeenCalledWith(
    "User is not assigned to this app"
  );
  expect(redirectedTo()).toBe("/home");
});
