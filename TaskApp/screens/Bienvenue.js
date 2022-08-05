import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import CustomTitle from "../components/CustomTitle";
import colors from "../constants/colors";

const Bienvenue = (props) => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/shape.png")} />
      <Image
        style={styles.image}
        source={require("../assets/undraw_mobile_ux_o0e11.png")}
      />
      <CustomTitle style={styles.title} title="Gets things done with TODO" />
      <CustomText
        style={styles.text}
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum dictum
        tempus, interdum at dignissim metus. Ultricies sed nunc."
      />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <CustomButton
          style={styles.button}
          title="Get Started"
          onPress={() => props.navigation.navigate("Inscription")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  image: {
    width: Dimensions.get("screen").width * 0.593,
    height: Dimensions.get("screen").height * 0.205,
    marginRight: Dimensions.get("screen").width * 0.254,
    marginTop: Dimensions.get("screen").height * 0.0711,
    marginLeft: Dimensions.get("screen").width * 0.259,
  },
  title: {
    marginTop: Dimensions.get("screen").height * 0.0542,
    marginLeft: Dimensions.get("screen").width * 0.259,
    marginRight: Dimensions.get("screen").width * 0.255,
  },
  text: {
    marginTop: Dimensions.get("screen").height * 0.043,
    marginLeft: Dimensions.get("screen").width * 0.122,
    marginRight: Dimensions.get("screen").width * 0.117,
  },
  button: {
    marginTop: Dimensions.get("screen").height * 0.11,
  },
});
export default Bienvenue;
