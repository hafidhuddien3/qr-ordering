import { StyleSheet } from "react-native";

import LanguageDropDown from "@/src/components/dropdown/language-dropdown";
import { ThemedText } from "@/src/components/themed-text";
import { View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View
      style={{
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: "hidden",
        backgroundColor: "white",
        marginTop: 30,
      }}
    >
      <ThemedText type="title">Settings</ThemedText>
      <ThemedText type="subtitle">Language</ThemedText>
      <LanguageDropDown />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
