import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { useState, useEffect } from "react";
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
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  //Handling the SignUp button
  const SignUpHandler = async (values,{resetForm}) => {
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
      setIsLoading(false);
      resetForm({ values: "" });
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
      setModalVisible(true);
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
            SignUpHandler(values, { resetForm });
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
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{error}</Text>
              <View style={styles.buttonContainer}>
                <Pressable
                  style={styles.buttonOK}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>OK</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.026,
  },
  modalView: {
    marginVertical: height * 0.015,
    marginHorizontal: width * 0.051,
    backgroundColor: "#BAEEF3",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    height: height * 0.13,
    width: width * 0.8,
    shadowOffset: {
      width: 0,
      height: height * 0.005,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    top: height * 0.012,
  },
  buttonOK: {
    borderRadius: 10,
    backgroundColor: "#35A7B2",
    height: height * 0.0422,
    width: width * 0.35,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: width * 0.0254,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "poppins-bold",
    fontSize: height * 0.018,
  },
  modalText: {
    marginBottom: height * 0.001,
    fontFamily: "poppins-regular",
    fontWeight: "400",
    textAlign: "center",
    paddingHorizontal: 15,
    top: width * 0.018,
    fontSize: height * 0.0217,
  },
});
export default Inscription;
