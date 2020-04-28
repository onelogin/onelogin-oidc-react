import nanoid from "nanoid";

import {
  RECEIVE_ACCESS_TOKEN,
  RECEIVE_ID_TOKEN,
  GENERATE_STATE_AND_NONCE,
  CLEAR_ALL
} from "../util/actionTypes";

const defaultState = {
  accessToken: null,
  idToken: null,
  state: null,
  nonce: null
};

const tokenReducer = (reduxState = defaultState, { type, payload }) => {
  switch (type) {
    case RECEIVE_ACCESS_TOKEN:
      return {
        ...reduxState,
        accessToken: payload.accessToken
      };
    case RECEIVE_ID_TOKEN:
      return {
        ...reduxState,
        idToken: payload.idToken
      };
    case GENERATE_STATE_AND_NONCE:
      return {
        ...reduxState,
        // no need to redefine if it exists in the state already
        state: reduxState.state || nanoid(32),
        nonce: reduxState.nonce || nanoid(32)
      }
    case CLEAR_ALL:
      return defaultState;
    default:
      return reduxState
  }
};

export default tokenReducer;
