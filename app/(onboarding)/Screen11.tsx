import { ImageBackground, StyleSheet } from "react-native";

export default function Screen11() {
  return (
    <ImageBackground
      source={require("../../assets/images/onboarding/fisherman.png")}
      style={styles.background}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
