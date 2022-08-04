import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";

import * as authActions from "../store/actions/auth";

const StartUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        navigation.navigate("Bienvenue");
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, fullname /*, expiryDate */ } = transformedData;
      //const expirationDate = new Date(expiryDate);
      if (!fullname || !token || !userId) {
        navigation.navigate("Bienvenue");
        return;
      }
      //const expirationTime = expirationDate.getTime() - new Date().getTime();
      navigation.navigate("Tasks");
      dispatch(authActions.authenticate(userId, token ,fullname));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartUpScreen;
