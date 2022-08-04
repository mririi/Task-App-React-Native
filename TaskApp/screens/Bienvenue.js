import { Image, StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import colors from "../constants/colors";

const Bienvenue = (props) => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/shape.png")} />
      <Image
        style={styles.image}
        source={require("../assets/undraw_mobile_ux_o0e11.png")}
      />
      <Text style={styles.title}>Gets things done with TODO</Text>
      <Text style={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum dictum
        tempus, interdum at dignissim metus. Ultricies sed nunc.
      </Text>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <CustomButton
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
    flex: 1,
  },
  title: {
    position: "absolute",
    top: "53.5%",
    marginLeft: "15.2%",
    marginRight: "12.2%",
    fontSize: 18,
    fontFamily: "poppins-bold",
    fontWeight: "600",
    lineHeight: 20.82,
    letterSpacing: 1,
    color: "#000000BF",
    fontStyle: "normal",
    textAlign: "center",
  },
  text: {
    position: "absolute",
    fontFamily: "poppins-regular",
    top: "60.5%",
    marginLeft: "12.2%",
    marginRight: "12.2%",
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 17.83,
    textAlign: "center",
    color: "#000000BD",
  },
  image: {
    position: "absolute",
    width: "40%",
    height: "20%",
    marginRight: "27%",
    top: "27%",
    marginLeft: "30%",
  },
});
export default Bienvenue;
