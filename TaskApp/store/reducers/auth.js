import { AUTHENTICATE, LOGOUT } from "../actions/auth";

//Initialising state
const initialState = {
  fullname: null,
};

//Handling actions
export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        fullname: action.fullname,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
