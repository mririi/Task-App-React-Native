import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../constants/colors";
import CustomTitle from "./CustomTitle";

const CustomButton = (props) => {
  return (
    <Pressable
      style={{ ...styles.button, ...props.style }}
      onPress={props.onPress}
    >
      <CustomTitle style={styles.title} title={props.title} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.button,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.827,
    height: Dimensions.get("screen").height * 0.0747,
  },
  title: {
    color: colors.buttontext,
  },
});
export default CustomButton;
