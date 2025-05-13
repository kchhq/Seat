import { StyleSheet, Text, View } from "react-native";

export default function MyPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>마이 페이지 입니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
