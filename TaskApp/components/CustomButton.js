import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../constants/colors";

const CustomButton = (props) => {
  return (
    <Pressable
      style={{ ...styles.button, ...props.style }}
      onPress={props.onPress}
    >
      <Text style={styles.title}>{props.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.button,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "120%",
    width: "86.6%",
    height: 62,
  },
  title: {
    fontSize: 18,
    color: colors.buttontext,
    letterSpacing: 1,
    fontWeight: "600",
    fontFamily: "poppins-bold",
    textAlign: "center",
  },
});
export default CustomButton;
