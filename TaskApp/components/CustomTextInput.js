import React, { useEffect, useReducer } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

//Declaring height and width of the device
const { height, width } = Dimensions.get("screen");


const CustomTextInput = (props) => {
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props;

  const hasError = errors[name] && touched[name];

  return (
    <View style={styles.container}>
      <TextInput
        {...inputProps}
        style={{ ...styles.input, ...props.style }}
        value={value}
        onChangeText={(text) => onChange(name)(text)}
        onBlur={() => {
          setFieldTouched(name);
          onBlur(name);
        }}
      />
      {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.763,
  },
  input: {
    marginTop: height * 0.025,
    height: height * 0.0615,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.063,
    fontFamily: "poppins-regular",
    fontSize: height * 0.0156,
    fontWeight: "400",
    lineHeight: height * 0.021,
    letterSpacing: 1,
    color: "#000000B2",
  },
  errorContainer: {
    marginTop: height * 0.006,
  },
  errorText: {
    fontSize: height * 0.0156,
    color: "#D24141",
  },
});
export default CustomTextInput;
