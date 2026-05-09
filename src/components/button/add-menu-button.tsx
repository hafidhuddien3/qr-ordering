import { choosedTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function AddButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: choosedTheme.primary,
        padding: 12,
        borderRadius: 8,
      }}
      onPress={onPress}
    >
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  );
}