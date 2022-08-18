import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import CustomTitle from "../components/CustomTitle";
import colors from "../constants/colors";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

//Declaring height and width of the device
const { height, width } = Dimensions.get("screen");

const Bienvenue = (props) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        setLoaded(true);
        return;
      }
      const { token } = JSON.parse(userData);
      dispatch(authActions.autologin(token));
      props.navigation.navigate("Tasks");
    };
    tryLogin();
  }, [dispatch]);
  return (
    <>
      {!loaded && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {loaded && (
        <View style={styles.container}>
          <Image source={require("../assets/shape.png")} />
          <Image
            resizeMode="contain"
            style={styles.image}
            source={require("../assets/undraw_mobile_ux_o0e11.png")}
          />
          <CustomTitle
            style={styles.title}
            title="Gets things done with TODO"
          />
          <CustomText
            style={styles.text}
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum dictum
        tempus, interdum at dignissim metus. Ultricies sed nunc."
          />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <CustomButton
              style={styles.button}
              title="Get Started"
              onPress={() => props.navigation.navigate("Inscription")}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  image: {
    width: width * 0.593,
    height: height * 0.205,
    marginRight: width * 0.254,
    marginTop: height * 0.0711,
    marginLeft: width * 0.259,
  },
  title: {
    marginTop: height * 0.0542,
    marginLeft: width * 0.122,
    marginRight: width * 0.117,
  },
  text: {
    marginTop: height * 0.043,
    marginLeft: width * 0.122,
    marginRight: width * 0.117,
  },
  button: {
    marginTop: height * 0.11,
  },
});
export default Bienvenue;
