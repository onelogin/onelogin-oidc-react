import { RECEIVE_PROFILE_DATA, CLEAR_ALL } from "../util/actionTypes";

const profileReducer = (state = null, { type, payload }) => {
  switch (type) {
    case RECEIVE_PROFILE_DATA:
      return {
        email: payload.profile.email,
        fullname: payload.profile.name,
        username: payload.profile.preferred_username,
        company: payload.profile.company,
        dept: payload.profile.department,
        title: payload.profile.title
      };
    case CLEAR_ALL:
      return null;
    default:
      return state;
  }
};

export default profileReducer;
