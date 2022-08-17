import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../config";
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
    const response = await fetch(config.API_URL + "/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        fullname: fullname,
        email: email,
        password: password1,
        password_confirmation: password2,
      }),
    });
    //Handling errors
    /*if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData;
      let message = "Something went wrongg!";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists already!";
      }
      throw new Error(message);
    }*/
  };
};

//Declaring the login action
export const login = (email, password) => {
  return async (dispatch) => {
    //Signing in the user
    const response = await fetch(config.API_URL + "/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    //Handling errors
    /*if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData;
      let message = "Something went wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid";
      }
      throw new Error(message);
    }*/
    const resData = await response.json();
    dispatch(authenticate(resData.user.fullname, resData.user.id));
    //Saving Data to the storage
    saveDataToStorage(resData.token);
  };
};

export const autologin = (token) => {
  return async (dispatch) => {
    //Signing in the user
    const response = await fetch(config.API_URL + "/users/" + token);
    const resData = await response.json();
    dispatch(authenticate(resData.fullname, resData.id));
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
