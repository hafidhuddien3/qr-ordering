import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  onPress?: () => void;
  accessibilityLabel: string;
};

export default function ScanButton({ onPress, accessibilityLabel }: Props) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#000",
        padding: 12,
        borderRadius: 8,
      }}
      onPress={onPress}
      accessibilityLabel= {accessibilityLabel}
    >

      <Ionicons name="qr-code-outline" size={24} color="white" />

      <Text style={{ color: "white", marginLeft: 8 }}>
        {t("start_qr_scan")}
      </Text>
    </TouchableOpacity>
  );
}

//note qr icons at Ionicons:
// qr-code
// qr-code-outline
// scan
// scan-outline