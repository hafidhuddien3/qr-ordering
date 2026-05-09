import { StyleSheet, View } from "react-native";

import ScanButton from "@/src/components/button/scan-qr-button";
import { HelloWave } from "@/src/components/hello-wave";
import ParallaxScrollView from "@/src/components/parallax-scroll-view";
import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { choosedTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: choosedTheme.primary }}
      headerImage={
<Ionicons name="restaurant" size={300} color={choosedTheme.secondary} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to QR Ordering!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedText>
        {`Please follow the steps below to place your order using our QR code ordering system. If you have any questions, feel free to ask our staff for assistance. Enjoy your meal!`}
      </ThemedText>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Scan QR</ThemedText>
        <View style={{ padding: 5, width: 200 }}>
          <Link href="/qr-scanner"><ScanButton /></Link>
          <Link href="/menu?tableId=T001">t1</Link>
        </View>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Browse Menu</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Add Items to Cart</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 4: Submit Order</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 5: Track Status</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
    color: choosedTheme.secondary
  },
});
