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
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const isDevMode = true;

export default function HomeScreen() {
  const { t } = useTranslation();
  const cart = useCartStore((state) => state.order);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: choosedTheme.primary, dark: choosedTheme.primary }}
      headerImage={
        <Ionicons name="restaurant" size={300} color={choosedTheme.secondary} />
      }
    >
      <View style={{ flex: 1, padding: 32, gap: 16, overflow: "hidden" }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{t("welcome_title")}</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedText>
          {t("welcome_description")}
        </ThemedText>
        <ThemedView style={styles.stepContainer}>
          <View
            style={{
              padding: 5,
              gap: 10,
              maxWidth: 200,
            }}
          >
              <ScanButton onPress={()=>router.push("/qr-scanner")} />
            {/* developer testing button, please ignore: */}
            {isDevMode ? (
              <IonIconButton
                iconName="construct-outline"
                text="menu?tableId=T001"
                onPress={() => {
                  router.push("/menu?tableId=T001");
                }}
              />
            ): null}
            {cart.table_id ? (
              <>
                <IonIconButton
                  iconName="time-outline"
                  text={t("last_scanned_table")}
                  onPress={() => {
                    router.push(`/menu?tableId=${cart.table_id}`);
                  }}
                />
                <IonIconButton
                  iconName="fast-food-outline"
                  text={t("order_tracking")}
                  onPress={() => {
                    router.push(`/order-tracking?tableId=${cart.table_id}`);
                  }}
                />
              </>
            ): null}
          </View>
        </ThemedView>
      </View>
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
