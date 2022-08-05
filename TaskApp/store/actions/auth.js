import AsyncStorage from "@react-native-async-storage/async-storage";
import Env from "../../constants/Env";

//Declaring action types
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

//Declaring the authenticate action
export const authenticate = (userId, token, fullname) => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE,
      userId: userId,
      token: token,
      fullname: fullname,
    });
  };
};

//Declaring the signup action
export const signup = (fullname, email, password1, password2) => {
  return async (dispatch) => {
    //Adding a user to the database
    const response = await fetch(Env.url + "/register/", {
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
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData;
      let message = "Something went wrongg!";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists already!";
      }
      throw new Error(message);
    }
    const resData = await response.json();
    dispatch(
      authenticate(
        resData.user.id,
        resData.user.fullname,
        resData.token,
        parseInt(resData.expiresIn) * 1000
      )
    );
    //Saving Data to the storage
    saveDataToStorage(resData.token, resData.user.id, resData.user.fullname);
  };
};

//Declaring the login action
export const login = (email, password) => {
  return async (dispatch) => {
    //Signing in the user
    const response = await fetch(Env.url + "/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    });
    //Handling errors
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData;
      let message = "Something went wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid";
      }
      throw new Error(message);
    }
    const resData = await response.json();
    dispatch(
      authenticate(resData.user.id, resData.token, resData.user.fullname)
    );
    //Saving Data to the storage
    saveDataToStorage(resData.token, resData.user.id, resData.user.fullname);
  };
};

//Declaring the logout action
export const logout = () => {
  //Removing userdata from the storage
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

//Declaring the function for saving data to the storage
const saveDataToStorage = (token, userId, fullname) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      fullname: fullname,
    })
  );
};
