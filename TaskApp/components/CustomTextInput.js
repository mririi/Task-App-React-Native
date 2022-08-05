import React, { useEffect, useReducer } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

//Declaring height and width of the device
const { height, width } = Dimensions.get("screen");

//Declaring the action types
const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";
const INPUT_SUBMITTED = "INPUT_SUBMITTED";
//End of declaration

//Declaring the input reducer
const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    case INPUT_SUBMITTED:
      return {
        ...state,
        value: "",
      };
    default:
      return state;
  }
};

const CustomTextInput = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid,
    touched: false,
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  //Handling the onBlur prop
  const lostFocusHandler = () => {
    //Setting the input as touched
    dispatch({ type: INPUT_BLUR });
    if (props.submitted) {
      //Clearing input value on submit
      dispatch({ type: INPUT_SUBMITTED });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={{ ...styles.input, ...props.style }}
        placeholder={props.placeholder}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
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
