import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  children?: React.ReactNode;
};

export default function ScanButton({ children }: Props) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#000",
        padding: 12,
        borderRadius: 8,
      }}
      onPress={() => console.log("Open QR Scanner")}
    >
    { children }

      <Ionicons name="qr-code-outline" size={24} color="white" />

      <Text style={{ color: "white", marginLeft: 8 }}>
        Start Scan QR
      </Text>
    </TouchableOpacity>
  );
}

//note qr icons at Ionicons:
// qr-code
// qr-code-outline
// scan
// scan-outline