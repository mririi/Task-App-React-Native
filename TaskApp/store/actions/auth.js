import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../config";
import axios from "axios";
//Declaring action types
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

//Declaring the authenticate action
export const authenticate = (fullname, userId) => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE,
      fullname: fullname,
      userId: userId,
    });
  };
};

//Declaring the signup action
export const signup = (fullname, email, password1, password2) => {
  return async (dispatch) => {
    //Adding a user to the database
    await axios
      .post(config.API_URL + "/register/", {
        fullname: fullname,
        email: email,
        password: password1,
        password_confirmation: password2,
      })
      .catch((error) => {
        console.log(error);
        let message = "Something went wrong, check your connection!";
        if (error.response.data.errors.email) {
          message = error.response.data.errors.email;
        } else {
          message = error.response.data.message;
        }
        throw new Error(message);
      });
  };
};

//Declaring the login action
export const login = (email, password) => {
  return async (dispatch) => {
    //Signing in the user
    await axios
      .post(config.API_URL + "/login/", {
        email: email,
        password: password,
      })
      .then((response) => {
        const resData = response.data;
        dispatch(authenticate(resData.user.fullname, resData.user.id));
        //Saving Data to the storage
        saveDataToStorage(resData.token);
      })
      .catch((error) => {
        console.log(error)
        let message = "Something went wrong, check your connection!";
        if (error.response.data.message) {
          message = error.response.data.message;
        } 
        throw new Error(message);
      });
  };
};

export const autologin = (token) => {
  return async (dispatch) => {
    axios.get(config.API_URL + "/users/" + token).then((response)=>{
      const resData = response.data;
      dispatch(authenticate(resData.fullname, resData.id));
    });
  };
};
//Declaring the logout action
export const logout = () => {
  //Removing userdata from the storage
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

//Declaring the function for saving data to the storage
const saveDataToStorage = (token) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
    })
  );
};
