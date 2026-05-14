import { api } from "@/src/api/apiMiddleware";
import { ThemedText } from "@/src/components/themed-text";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function QRScanner() {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedSuccess, setScannedSuccess] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    requestPermission();
    return <Text>{t("request_camera_permission")}</Text>;
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
                  : alert(t("invalid_qr"));

                tableId && api
                  .getMenuForATable(tableId)
                  .then((response: any) => {
                    if (response.success == true) {
                      setScannedSuccess(true);
                      router.replace(`/menu?tableId=${tableId}`);

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
        <ThemedText type="link">{t("close_qr_scanner")}</ThemedText>
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
