import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState, useEffect, useReducer, useCallback } from "react";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import colors from "../constants/colors";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};
const Inscription = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      fullname: "",
      email: "",
      password1: "",
      password2: "",
    },
    inputValidities: {
      fullname: false,
      email: false,
      password1: false,
      password2: false,
    },
    formIsValid: false,
  });
  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Ok" }]);
    }
  }, [error]);
  const SignUpHandler = async () => {
    Keyboard.dismiss();
    action = authActions.signup(
      formState.inputValues.fullname,
      formState.inputValues.email,
      formState.inputValues.password1,
      formState.inputValues.password2
    );
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Authentification");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={30}
      style={styles.screen}
    >
      <ScrollView>
        <Image source={require("../assets/shape.png")} />
        <Text style={styles.title}>Welcome Onboard!</Text>
        <Text style={styles.text}>Let’s help you meet up your tasks</Text>
        <View style={styles.formContainer}>
          <CustomTextInput
            style={styles.nameInput}
            id="fullname"
            required
            placeholder="Enter your full name"
            errorText="Full name is required"
            onInputChange={inputChangeHandler}
          />
          <CustomTextInput
            id="email"
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            placeholder="Enter your email"
            errorText="Please enter a valid email"
            onInputChange={inputChangeHandler}
          />
          <CustomTextInput
            id="password1"
            secureTextEntry
            required
            autoCapitalize="none"
            placeholder="Enter password"
            errorText="Password is required"
            onInputChange={inputChangeHandler}
          />
          <CustomTextInput
            id="password2"
            secureTextEntry
            required
            autoCapitalize="none"
            placeholder="Confirm Password"
            errorText="Confirm password is required"
            onInputChange={inputChangeHandler}
          />
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <CustomButton
              style={styles.button}
              title="Register"
              onPress={SignUpHandler}
            />
          )}
          <Text style={styles.signIn}>
            Already have an account ?{" "}
            <Text
              style={styles.link}
              onPress={() => props.navigation.navigate("Authentification")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    position: "absolute",
    top: "29.1%",
    left: 92,
    fontSize: 18,
    fontFamily: "poppins-bold",
    fontWeight: "600",
    letterSpacing: 1,
    color: "#000000BF",
  },
  text: {
    position: "absolute",
    top: "33.4%",
    left: "18.4%",
    fontFamily: "poppins-regular",
    fontWeight: "400",
    lineHeight: 17.83,
    textAlign: "center",
    color: "#000000BD",
    fontSize: 13,
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop:81
  },
  nameInput: {
    marginTop: 49,
  },
  button: {
    marginTop: 50,
    marginRight: 24,
    marginLeft: 26,
  },
  signIn: {
    fontFamily: "poppins-regular",
    marginTop: 23,
    marginLeft: 56,
    marginRight: 52,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 16.2,
  },
  link: {
    color: colors.button,
    fontFamily: "poppins-bold",
    fontWeight: "400",
  },
});
export default Inscription;
