import {
  RECEIVE_ACCESS_TOKEN,
  RECEIVE_ID_TOKEN,
  GENERATE_STATE_AND_NONCE
} from "../util/actionTypes";

export const receiveAccessToken = accessToken => ({
  type: RECEIVE_ACCESS_TOKEN,
  payload: { accessToken }
});

export const receiveIdToken = idToken => ({
  type: RECEIVE_ID_TOKEN,
  payload: { idToken }
});

export const generateStateAndNonce = () => ({
  type: GENERATE_STATE_AND_NONCE
});
