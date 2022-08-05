import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useState, useEffect, useReducer, useCallback } from "react";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import colors from "../constants/colors";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import CustomText from "../components/CustomText";
import CustomTitle from "../components/CustomTitle";
import CustomLink from "../components/CustomLink";

//Declaring height and width of the device
const { height, width } = Dimensions.get("screen");

//Declaring the action type
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

//Declaring the form reducer
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

  //Initializing the form state
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      fullname: "",
      email: "",
      password1: "",
      password2: "", //Password Confirmation
    },
    inputValidities: {
      fullname: false,
      email: false,
      password1: false,
      password2: false, //Password Confirmation
    },
    formIsValid: false,
  });

  //Handling the SignUp button
  const SignUpHandler = async () => {
    Keyboard.dismiss();
    //Declaring the action
    action = authActions.signup(
      formState.inputValues.fullname,
      formState.inputValues.email,
      formState.inputValues.password1,
      formState.inputValues.password2
    );
    setError(null);
    setIsLoading(true);
    try {
      //Dispatching the action
      await dispatch(action);
      //Navigation to the Authentification screen
      props.navigation.navigate("Authentification");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  //Handling the input Data
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

  //Creating an error Alert
  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Ok" }]);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={30}
      style={styles.screen}
    >
      <ScrollView>
        <Image source={require("../assets/shape.png")} />
        <CustomTitle style={styles.title} title="Welcome Onboard!" />
        <CustomText
          style={styles.text}
          text="Let’s help you meet up your tasks"
        />
        <View style={styles.formContainer}>
          <CustomTextInput
            style={styles.nameInput}
            id="fullname"
            required
            placeholder="Enter your full name"
            errorText="Full name is required"
            onInputChange={inputChangeHandler}
            returnKeyType="next"
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
            returnKeyType="next"
          />
          <CustomTextInput
            id="password1"
            secureTextEntry
            required
            autoCapitalize="none"
            placeholder="Enter password"
            errorText="Password is required"
            onInputChange={inputChangeHandler}
            returnKeyType="next"
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
          <CustomLink
            style={styles.signIn}
            text="Already have an account ? "
            link="Sign In"
            onPress={() => props.navigation.navigate("Authentification")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  title: {
    marginTop: height * 0.091,
  },
  text: {
    marginTop: height * 0.016,
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  nameInput: {
    marginTop: height * 0.059,
  },
  button: {
    marginTop: height * 0.06,
    marginRight: width * 0.061,
    marginLeft: width * 0.066,
  },
  signIn: {
    marginTop: height * 0.0277,
  },
});
export default Inscription;
