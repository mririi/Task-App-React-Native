import AsyncStorage from "@react-native-async-storage/async-storage";
import Env from "../../constants/Env";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

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

export const signup = (fullname, email, password1, password2) => {
  return async (dispatch) => {
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
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.token, resData.user.id, resData.user.fullname);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
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
    saveDataToStorage(resData.token, resData.user.id, resData.user.fullname);
  };
};

export const logout = () => {
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

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
