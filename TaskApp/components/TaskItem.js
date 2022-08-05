import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

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
    marginTop: Dimensions.get("screen").height * 0.0217,
    marginLeft: Dimensions.get("screen").width * 0.076,
  },
  checkbox: {
    right: 1,
    backgroundColor: "#ffffff",
    borderColor: colors.primary,

    width: Dimensions.get("screen").width * 0.043,
    height: Dimensions.get("screen").height * 0.0205,
  },
  title: {
    marginLeft: Dimensions.get("screen").width * 0.028,
    fontFamily: "poppins-regular",
    fontWeight: "400",
    fontSize: Dimensions.get("screen").height * 0.0144,
    lineHeight: Dimensions.get("screen").height * 0.0166,
    letterSpacing: 1,
    color: "#000000BF",
  },
});
export default TaskItem;
