import React from "react";
import { Dimensions, StyleSheet, Text } from "react-native";

const CustomText = props => {
  return (
    <Text {...props} style={{ ...styles.text, ...props.style }}>
      {props.text}
    </Text>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: "poppins-regular",
    fontSize: Dimensions.get("screen").height * 0.0156,
    fontWeight: "400",
    lineHeight: Dimensions.get("screen").height * 0.021,
    letterSpacing: 1,
    textAlign: "center",
    color: "#000000BD",
  },
});
export default CustomText;
