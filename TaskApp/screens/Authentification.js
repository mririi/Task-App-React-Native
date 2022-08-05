import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
import CustomTitle from "../components/CustomTitle";
import CustomLink from "../components/CustomLink";
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
        <CustomTitle style={styles.title} title="Welcome Back!" />
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
          <CustomLink
            style={styles.signIn}
            text="Don't have an account ? "
            link="Sign Up"
            onPress={() => props.navigation.navigate("Inscription")}
          />
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
    marginTop: Dimensions.get("screen").height * 0.0422,
  },
  image: {
    width: Dimensions.get("screen").width * 0.435,
    height: Dimensions.get("screen").height * 0.205,
    left: Dimensions.get("screen").width * 0.259,
    marginTop: Dimensions.get("screen").height * 0.046,
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  email: {
    marginTop: Dimensions.get("screen").height * 0.0554,
  },
  button: {
    marginTop: Dimensions.get("screen").height * 0.0603,
    marginRight: Dimensions.get("screen").width * 0.061,
    marginLeft: Dimensions.get("screen").width * 0.061,
  },
  signIn: {
    marginTop: Dimensions.get("screen").height * 0.0349,
  },
});
export default Authentification;
