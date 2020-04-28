import { RECEIVE_PROFILE_DATA } from "../util/actionTypes";

export const receiveProfileData = profile => ({
  type: RECEIVE_PROFILE_DATA,
  payload: { profile }
});
