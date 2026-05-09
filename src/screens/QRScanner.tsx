import { CameraView, useCameraPermissions } from "expo-camera";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../api/apiMiddleware";
import { ThemedText } from "../components/themed-text";

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedSuccess, setScannedSuccess] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    requestPermission();
    return <Text>Requesting camera permission...</Text>;
  }

  return (
    <>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={
          scannedSuccess
            ? undefined
            : ({ data }) => {
                let tableId = null;
                // format: ipot://table/{tableId}
                data.includes("ipot://table/") && data.split("ipot://table/").length > 1
                  ? tableId = data.split("ipot://table/")[1]
                  : alert("Invalid QR code format. Please contact staff for assistance.");

                tableId && api
                  .getMenuForATable(tableId)
                  .then((response: any) => {
                    if (response.success == true) {
                      setScannedSuccess(true);
                      // store menu data in cache or state management for later use in menu page

                      // go to menu page 

                    } else {
                      alert(response?.message);
                    }
                  })
                  .catch((error) => {
                    alert("Error: " + error?.message);
                  });
              }
        }
      />
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Close QR Scanner</ThemedText>
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  link: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.08,
    textAlign: "center",
  },
});
