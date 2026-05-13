import { StyleSheet, View } from "react-native";

import IonIconButton from "@/src/components/button/ion-icon-button";
import ScanButton from "@/src/components/button/scan-qr-button";
import { HelloWave } from "@/src/components/hello-wave";
import ParallaxScrollView from "@/src/components/parallax-scroll-view";
import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { choosedTheme } from "@/src/constants/theme";
import { useCartStore } from "@/src/state/stores/useCartStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

const isDevMode = true;

export default function HomeScreen() {
  const cart = useCartStore((state) => state.order);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: choosedTheme.primary }}
      headerImage={
        <Ionicons name="restaurant" size={300} color={choosedTheme.secondary} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to {"\n"}QR Ordering!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedText>
        {`Please click start scan QR code to see menu. If you have any questions, feel free to ask our staff for assistance. Enjoy your meal!`}
      </ThemedText>
      <ThemedView style={styles.stepContainer}>
        <View
          style={{
            padding: 5,
            gap: 10,
            maxWidth: 200,
          }}
        >
          <Link href="/qr-scanner">
            <ScanButton />
          </Link>
          {/* developer testing button, please ignore: */}
          {isDevMode && (
            <IonIconButton
              iconName="construct-outline"
              text="menu?tableId=T001"
              onPress={() => {
                router.push("/menu?tableId=T001");
              }}
            />
          )}
          {cart.table_id && (
            <IonIconButton
              iconName="fast-food-outline"
              text="Order Tracking"
              onPress={() => {
                router.push(`/order-tracking?tableId=${cart.table_id}`);
              }}
            />
          )}
        </View>
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
    color: choosedTheme.secondary,
  },
});
