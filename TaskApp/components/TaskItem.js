import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

const { height, width } = Dimensions.get("screen");

const TaskItem = (props) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <View {...props} style={styles.container}>
      <Checkbox
        style={styles.checkbox}
        disabled={false}
        value={toggleCheckBox}
        onValueChange={props.onValueChange}
      />
      <Text numberOfLines={1} style={styles.title}>
        {props.title}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: height * 0.0217,
    marginLeft: width * 0.076,
  },
  checkbox: {
    right: 1,
    backgroundColor: "#ffffff",
    borderColor: colors.primary,
    width: width * 0.043,
    height: height * 0.0205,
  },
  title: {
    marginLeft: width * 0.028,
    fontFamily: "poppins-regular",
    fontWeight: "400",
    fontSize: height * 0.0144,
    lineHeight: height * 0.0166,
    letterSpacing: 1,
    color: "#000000BF",
  },
});
export default TaskItem;
