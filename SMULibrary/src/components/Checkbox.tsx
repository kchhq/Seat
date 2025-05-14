import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const Checkbox = ({ label }: { label: string }) => {
  const [checked, setChecked] = useState(false);

  return (
    <Pressable
      onPress={() => setChecked(!checked)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 4,
          backgroundColor: checked ? "#2563EB" : "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
      </View>
      <Text style={{ fontSize: 14, color: "#333" }}>{label}</Text>
    </Pressable>
  );
};

export default Checkbox;
