import React from "react";
import { Dimensions, StyleSheet, Text } from "react-native";

const CustomTitle = props => {
  return (
    <Text {...props} style={{ ...styles.title, ...props.style }}>
      {props.title}
    </Text>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: Dimensions.get("screen").height * 0.021,
    fontFamily: "poppins-bold",
    fontWeight: "600",
    lineHeight: Dimensions.get("screen").height * 0.025,
    letterSpacing: 1,
    color: "#000000BF",
    fontStyle: "normal",
    textAlign: "center",
  },
});
export default CustomTitle;
