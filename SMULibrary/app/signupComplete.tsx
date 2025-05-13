import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const signupComplete = () => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/login")}>
        <Image
          source={require("./assets/checkicon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.textBlock}>
        <Text style={styles.welcome}>환영합니다!</Text>
      </View>
    </View>
  );
};

export default signupComplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  textBlock: {
    alignItems: "flex-start",
  },
  welcome: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A7AEB7",
  },
});
