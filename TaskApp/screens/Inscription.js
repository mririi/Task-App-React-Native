import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { useState, useEffect, useReducer, useCallback } from "react";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import colors from "../constants/colors";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import CustomText from "../components/CustomText";
import CustomTitle from "../components/CustomTitle";
import CustomLink from "../components/CustomLink";
import { Formik, Field } from "formik";
import * as yup from "yup";

//Declaring height and width of the device
const { height, width } = Dimensions.get("screen");
const signUpValidationSchema = yup.object().shape({
  fullName: yup
    .string()
    .matches(/(\w.+\s).+/, "Enter at least 2 names")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const Inscription = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //Handling the SignUp button
  const SignUpHandler = async (values) => {
    //Declaring the action
    action = authActions.signup(
      values.fullName,
      values.email,
      values.password,
      values.confirmPassword
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

  //Creating an error Alert
  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Ok" }]);
    }
  }, [error]);

  return (
    <KeyboardAvoidingScrollView style={styles.screen}>
      <Image source={require("../assets/shape.png")} />
      <CustomTitle style={styles.title} title="Welcome Onboard!" />
      <CustomText
        style={styles.text}
        text="Let’s help you meet up your tasks"
      />
      <View style={styles.formContainer}>
        <Formik
          validationSchema={signUpValidationSchema}
          initialValues={{
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values, { resetForm }) => {
            SignUpHandler(values);
            resetForm({ values: "" });
          }}
        >
          {({ handleSubmit, isValid }) => (
            <>
              <Field
                component={CustomTextInput}
                name="fullName"
                placeholder="Full Name"
              />
              <Field
                component={CustomTextInput}
                name="email"
                placeholder="Email Address"
                keyboardType="email-address"
              />
              <Field
                component={CustomTextInput}
                name="password"
                placeholder="Password"
                secureTextEntry
              />
              <Field
                component={CustomTextInput}
                name="confirmPassword"
                placeholder="Confirm Password"
                secureTextEntry
              />
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <CustomButton
                  style={styles.button}
                  title="Register"
                  onPress={handleSubmit}
                  disabled={!isValid}
                />
              )}
            </>
          )}
        </Formik>
        <CustomLink
          style={styles.signIn}
          text="Already have an account ? "
          link="Sign In"
          onPress={() => props.navigation.navigate("Authentification")}
        />
      </View>
    </KeyboardAvoidingScrollView>
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
