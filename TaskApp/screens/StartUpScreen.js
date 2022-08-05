import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
import * as authActions from "../store/actions/auth";

const StartUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  //Handling auto login on app start
  useEffect(() => {
    const tryLogin = async () => {
      //Getting userData from Storage
      const userData = await AsyncStorage.getItem("userData");
      //Checking if userData exists else navigating to Bienvenue screen
      if (!userData) {
        navigation.navigate("Bienvenue");
        return;
      }
      //If user exists we get parse the JSON Data recieved
      const transformedData = JSON.parse(userData);
      //Getting the token, userId, fullname from the userData
      const { token, userId, fullname } = transformedData;
      //Checking if one of them doesn't exist
      if (!fullname || !token || !userId) {
        //If one or more of them doesn't exist we redirect the user to the Bienvenue screen
        navigation.navigate("Bienvenue");
        return;
      }
      //If all the data exists we navigate the user to the Tasks screen
      navigation.navigate("Tasks");
      //Calling the authenticate action
      dispatch(authActions.authenticate(userId, token, fullname));
    };
    //Trying to login
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
