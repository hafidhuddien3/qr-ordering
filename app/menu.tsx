import { api } from "@/src/api/apiMiddleware";
import { cacheObject } from "@/src/cache/cache";
import AddButton from "@/src/components/button/add-menu-button";
import IonIconButton from "@/src/components/button/ion-icon-button";
import { OfflineIndicator } from "@/src/components/offline-indicator";
import { choosedTheme } from "@/src/constants/theme";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { MenuResponse } from "@/src/models/menuResponse";
import { useCartStore } from "@/src/state/stores/useCartStore";
import { useCategoryStore } from "@/src/state/stores/useCategoryStore";
import { useQuery } from "@tanstack/react-query";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuScreen() {
  const { t } = useTranslation();
  const [menuByCategory, setMenuByCategory] = useState<
    MenuResponse["categories"]
  >([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const { tableId } = useLocalSearchParams();
  const { isOffline } = useNetworkStatus();

  const { data, isLoading } = useQuery({
    queryKey: ["menu", tableId],
    queryFn: () => api.getMenuForATable(tableId.toString()),
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 24 * 2, // 2 day
    enabled: !!tableId,
  });

  const { data: dataCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getListMenuCategories(),
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 24 * 2, // 2 day
  });

  const cart = useCartStore((state) => state.order);
  const setCategories = useCategoryStore((state) => state.setCategories);
  const setTableId = useCartStore((state) => state.setTableId);

  const totalPrice = useMemo(() => {
    return cart.item.reduce((total, item) => {
      let itemPrice = item.price || 0;
      item.customizations.forEach((customization) => {
        itemPrice += customization.price_modifier || 0;
      });
      return total + itemPrice * item.quantity;
    }, 0);
  }, [cart]);

  useEffect(() => {
    setTotal(cart.item.length);
    cacheObject.cartItemLength = cart.item.length;
  }, [cart]);

  const filteredMenu = menuByCategory.map((category) => ({
    ...category,
    items: category?.items?.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  useEffect(() => {
    if (data) {
      setCategories(data?.data?.categories || []);
      const categories = data?.data?.categories || [];
      categories.forEach((category) => {
        category.items = data?.data?.items.filter(
          (item) => item.category_id === category.id
        );
      });
      setMenuByCategory(categories);
      setTableId(data?.data?.restaurant.table_id || "");
    }
  }, [data]);

  //animation
  const scale = useSharedValue(0);
  const translateY = useSharedValue(-500);
  const waterScale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const waterDrop = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const water = useAnimatedStyle(() => {
    return {
      transform: [{ scale: waterScale.value }],
    };
  });

  const config = {
    duration: 1,
  };

  const startAnimation = () => {
    if (cacheObject.cartItemLength != cart.item.length) {
      setTotal(cart.item.length - 1);
      setTimeout(() => {
        setTotal(cart.item.length);
      }, 2000);
    }

    // STEP 1 — scale down
    scale.value = withSequence(
      withTiming(10, config),
      withDelay(20, withTiming(1, { duration: 500 })),
      withDelay(1500, withTiming(0, { duration: 1 }))
    );

    // STEP 2 — move after scale
    translateY.value = withSequence(
      withDelay(1000, withTiming(-40, { duration: 500 })),
      withDelay(500, withTiming(-500, { duration: 1 }))
    );

    opacity.value = withSequence(
      withDelay(1500, withTiming(0, { duration: 500 })),
      withDelay(500, withTiming(1, { duration: 1 }))
    );

    // STEP 3 — vibration/wobble after moving
    waterScale.value = withDelay(
      1500,
      withSequence(
        withTiming(1.6, { duration: 100 }),
        withTiming(1.2, { duration: 100 }),
        withTiming(1.3, { duration: 50 }),
        withSpring(1)
      )
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (cacheObject.shouldAnimateCart) {
        startAnimation();
        cacheObject.shouldAnimateCart = false;
      }
    }, [cacheObject.shouldAnimateCart])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: choosedTheme.background }}>
      <Stack.Screen
        options={{ title: t("menu_at") + " " + data?.data?.restaurant.name }}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          margin: 10,
          marginBottom: 1,
        }}
      >
        {tableId ? `${t("table_id")}: ${tableId}` : t("no_table_id")}
      </Text>
      <TextInput
        placeholder={t("search_menu_placeholder")}
        value={search}
        onChangeText={setSearch}
        style={{
          padding: 10,
          borderWidth: 1,
          borderRadius: 8,
          margin: 10,
        }}
      />

      <ScrollView>
        {filteredMenu.map((category) => (
          <View key={category.id}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                margin: 10,
                marginBottom: 1,
              }}
            >
              {category.name}
            </Text>

            {category?.items?.map((item) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: 10,
                }}
                key={item.id}
              >
                <View
                  key={item.id}
                  style={{
                    padding: 10,
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                    maxWidth: "80%",
                    gap: 3,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  <Text style={{ color: "gray" }}>{item.description}</Text>
                  <Text>USD {item.price}</Text>
                </View>
                <AddButton
                  accessibilityLabel="Add item to cart"
                  onPress={() => {
                    cacheObject.currentMenuItem = item;
                    router.push({
                      pathname: "/add-item",
                    });
                  }}
                />
              </View>
            ))}
            {category?.items?.length === 0 && (
              <Text style={{ padding: 10, color: "gray" }}>-</Text>
            )}
          </View>
        ))}
      </ScrollView>
      {isOffline && <OfflineIndicator />}
      <Pressable
      >
        <Animated.View style={[styles.box, waterDrop]} />
      </Pressable>
      <Animated.View
        style={[
          {
            flexDirection: "row",
            padding: 10,
            backgroundColor: choosedTheme.secondary,
            paddingRight: 25,
          },
          water,
        ]}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
            USD {totalPrice.toFixed(2)}
          </Text>
        </View>
        <IonIconButton
          accessibilityLabel="Go to cart"
          iconName={"cart"}
          onPress={() => router.push("/cart")}
          text={total.toString()}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "lightblue",
  },
  box: {
    position: "absolute",
    width: 100,
    height: 100,
    backgroundColor: choosedTheme.secondary,
    borderRadius: 500,

    top: "50%",
    left: "36%",
  },
  water: {
    width: "100%",
    height: 100,
  },
});
