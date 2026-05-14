import { choosedTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type Props = {
  onPress?: () => void;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  text?: string;
  padding?: number;
  loading?: boolean;
  testID?: string;
};

export default function IonIconButton({ onPress, iconName, text, padding, loading, testID }: Props) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: choosedTheme.primary,
        padding: padding || 10,
        borderRadius: 10,
        gap: 5
      }}
      disabled={loading}
      onPress={onPress}
      testID={testID}
    >
      {iconName && <Ionicons name={iconName} size={24} color="white" />}
      {text && <Text style={{ color: "white", marginLeft: 0, fontWeight:'500' }}>{text}</Text>}
      {loading && <ActivityIndicator />}
    </TouchableOpacity>
  );
}
