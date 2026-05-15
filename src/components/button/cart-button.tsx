import { choosedTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  onPress?: () => void;
  accessibilityLabel: string;
};

export default function CartButton({ onPress, accessibilityLabel }: Props) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: choosedTheme.primary,
        padding: 10,
        borderRadius: 10,
      }}
      onPress={onPress}
      accessibilityLabel= {accessibilityLabel}
    >
      <Ionicons name="cart" size={24} color="white" />
    </TouchableOpacity>
  );
}