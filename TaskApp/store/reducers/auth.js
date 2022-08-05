import { AUTHENTICATE, LOGOUT } from "../actions/auth";

//Initialising state
const initialState = {
  token: null,
  userId: null,
  fullname: null,
};

//Handling actions
export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        fullname: action.fullname,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
