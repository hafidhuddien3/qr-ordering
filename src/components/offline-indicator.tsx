import { Text, View } from "react-native";

export const OfflineIndicator = () => {
  return (
    <View style={{ backgroundColor: "red", padding: 10 }}>
      <Text style={{ color: "white", textAlign: "center" }}>
        You are offline
      </Text>
    </View>
  );
};
