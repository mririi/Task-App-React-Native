import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import colors from "../constants/colors";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { useCallback, useEffect, useReducer, useState } from "react";
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

const Authentification = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });
  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Ok" }]);
    }
  }, [error]);

  const LoginHandler = async () => {
    Keyboard.dismiss();
    action = authActions.login(
      formState.inputValues.email,
      formState.inputValues.password
    );
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Tasks");
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
      style={styles.container}
    >
      <ScrollView>
        <Image source={require("../assets/shape.png")} />
        <Text style={styles.title}>Welcome Back!</Text>
        <Image
          style={styles.image}
          source={require("../assets/undraw_my_notifications.png")}
        />
        <View style={styles.formContainer}>
          <CustomTextInput
            style={styles.email}
            id="email"
            keyboardType="email-address"
            required
            email
            onInputChange={inputChangeHandler}
            errorText="Email is required"
            autoCapitalize="none"
            placeholder="Enter your email"
          />
          <CustomTextInput
            id="password"
            secureTextEntry
            required
            autoCapitalize="none"
            placeholder="Enter your password"
            onInputChange={inputChangeHandler}
            errorText="Password is required"
          />
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <CustomButton
              style={styles.button}
              title="Sign In"
              onPress={LoginHandler}
            />
          )}
          <Text style={styles.signIn}>
            Don’t have an account ?{" "}
            <Text
              style={styles.link}
              onPress={() => props.navigation.navigate("Inscription")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    marginTop: "4.3%",
    left: 92,
    fontSize: 18,
    fontFamily: "poppins-bold",
    fontWeight: "600",
    lineHeight: 20.82,
    letterSpacing: 1,
    color: "#000000BF",
  },
  image: {
    width: 172.56,
    height: 170,
    marginRight: 100.44,
    marginTop: 35,
    marginLeft: 102,
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  email: {
    marginTop: "5.6%",
  },
  button: {
    marginTop: 50,
    marginRight: 24,
    marginLeft: 26,
  },
  signIn: {
    fontFamily: "poppins-regular",
    marginTop: "3.5%",
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
export default Authentification;
