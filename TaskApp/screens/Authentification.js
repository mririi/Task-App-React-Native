import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import colors from "../constants/colors";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { useEffect, useState } from "react";
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
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  //Handling the login button
  const LoginHandler = async (values, { resetForm }) => {
    Keyboard.dismiss();
    //Declaring the action
    action = authActions.login(values.email, values.password);
    setError(null);
    setIsLoading(true);
    try {
      //Dispatching the login action
      await dispatch(action);
      resetForm({ values: "" });
      setIsLoading(false);
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
      setModalVisible(true);
    }
  }, [error]);

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
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
          onSubmit={(values, { resetForm }) => {
            LoginHandler(values, { resetForm });
          }}
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
    height: height * 0.15,
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
    marginBottom: height * 0.018,
    fontFamily: "poppins-regular",
    fontWeight: "400",
    textAlign: "center",
    top: width * 0.018,
    fontSize: height * 0.0217,
  },
});
export default Authentification;
