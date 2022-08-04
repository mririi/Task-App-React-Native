import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    marginTop: 18,
    marginLeft: 30,
  },
  checkbox: {
    right: 1,
    backgroundColor: "#ffffff",
    borderColor: colors.primary,

    width: 17,
    height: 17,
  },
  title: {
    marginLeft: 11,
    fontFamily: "poppins-regular",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 13.88,
    letterSpacing: 1,
    color: "#000000BF",
  },
});
export default TaskItem;
