import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { choosedTheme } from "@/src/constants/theme";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import "@/src/i18n";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDisableDualTheme = true;

  return (
    <SafeAreaProvider>
      <ThemeProvider
        value={
          colorScheme !== "dark"
            ? isDisableDualTheme
              ? DefaultTheme
              : DarkTheme
            : DefaultTheme
        }
      >
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} /> */}
            <Stack.Screen name="qr-scanner" options={{ title: "QR Scanner" }} />
            <Stack.Screen
              name="add-item"
              options={{
                presentation: "modal",
                title: t("add_item"),
                headerStyle: {
                  backgroundColor: choosedTheme.primary,
                },
                headerTintColor: "#FFFFFF",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="menu"
              options={{
                title: t("menu"),
                headerStyle: {
                  backgroundColor: choosedTheme.primary,
                },
                headerTintColor: "#FFFFFF",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="cart"
              options={{
                title: t("cart"),
                headerStyle: {
                  backgroundColor: choosedTheme.primary,
                },
                headerTintColor: "#FFFFFF",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="order-tracking"
              options={{
                title: t("order_tracking"),
                headerStyle: {
                  backgroundColor: choosedTheme.primary,
                },
                headerTintColor: "#FFFFFF",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
