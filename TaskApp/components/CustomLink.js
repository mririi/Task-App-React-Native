import React from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import colors from "../constants/colors";

const CustomLink = (props) => {
  return (
    <Text {...props} style={{ ...styles.text, ...props.style }}>
      {props.text}
      <Text style={styles.link} onPress={props.onPress}>
        {props.link}
      </Text>
    </Text>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: "poppins-regular",
    marginLeft: Dimensions.get("screen").height * 0.142, //
    marginRight: Dimensions.get("screen").width * 0.132, //
    fontWeight: "700",
    fontSize: Dimensions.get("screen").height * 0.0168,
    lineHeight: Dimensions.get("screen").height * 0.019,
  },
  link: {
    color: colors.button,
    fontFamily: "poppins-bold",
    fontWeight: "400",
  },
});
export default CustomLink;
