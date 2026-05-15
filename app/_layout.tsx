import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { api } from "@/src/api/apiMiddleware";
import { choosedTheme } from "@/src/constants/theme";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import "@/src/i18n";
import { useOrderQueue } from "@/src/state/stores/useOrderQueue";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

if (Platform.OS !== "web") {
  const persister = createAsyncStoragePersister({
    storage: AsyncStorage,
  });

  persistQueryClient({
    queryClient,
    persister,
  });
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDisableDualTheme = true;

const syncingRef = useRef(false);

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(async (state) => {
    if (!state.isConnected) return;

    if (syncingRef.current) return;

    syncingRef.current = true;

    try {
      const queue = useOrderQueue.getState().queue;
      if  (queue.length > 0 ) {
        alert("Syncing " + queue.length + " orders...");
      }

      for (const order of queue) {
        try {
          const res = await api.postOrder(order.orderData);

          if (res?.data?.id) {
            useOrderQueue.getState().removeOrder(order.id);
          }
        } catch (err) {
          console.log("Failed sync", err);
        }
      }
    } finally {
      syncingRef.current = false;
    }
  });

  return () => unsubscribe();
}, []);

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
