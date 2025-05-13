//웹의 루트 경로 /에 해당하는 기본 화면, 즉 앱의 첫 진입 화면을 담당해.

import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function StartPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/login")}>
        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.textBlock}>
        <Text style={styles.university}>상명대학교</Text>
        <Text style={styles.system}>좌석 예약 시스템</Text>
      </View>
    </View>
  );
}

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
  university: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A7AEB7",
  },
  system: {
    fontSize: 14,
    color: "#D1D5DA",
  },
});
