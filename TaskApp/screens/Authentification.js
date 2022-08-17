import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
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
import { Formik, Field } from "formik";
import * as yup from "yup";
//Declaring height and width of the device
const { height, width } = Dimensions.get("screen");

const signInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});
const Authentification = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //Handling the login button
  const LoginHandler = async (values) => {
    Keyboard.dismiss();
    //Declaring the action
    action = authActions.login(values.email, values.password);
    setError(null);
    setIsLoading(true);
    try {
      //Dispatching the login action
      await dispatch(action);
      //Navigation to the Tasks Screen
      props.navigation.navigate("Tasks");
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={30}
      style={styles.container}
    >
      <ScrollView>
        <Image source={require("../assets/shape.png")} />
        <CustomTitle style={styles.title} title="Welcome Back!" />
        <View style={styles.image}>
          <Image source={require("../assets/undraw_my_notifications.png")} />
        </View>
        <View style={styles.formContainer}>
          <Formik
            validationSchema={signInValidationSchema}
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values) => LoginHandler(values)}
          >
            {({ handleSubmit, isValid }) => (
              <>
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
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <CustomButton
                    style={styles.button}
                    title="Sign In"
                    onPress={handleSubmit}
                    disabled={!isValid}
                  />
                )}
              </>
            )}
          </Formik>

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
    marginTop: height * 0.0422,
  },
  image: {
    width: width * 0.435,
    height: height * 0.205,
    left: width * 0.259,
    marginTop: height * 0.046,
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  email: {
    marginTop: height * 0.0554,
  },
  button: {
    marginTop: height * 0.0603,
    marginRight: width * 0.061,
    marginLeft: width * 0.061,
  },
  signIn: {
    marginTop: height * 0.0349,
  },
});
export default Authentification;
