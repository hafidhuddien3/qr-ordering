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
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuScreen() {
  const { t } = useTranslation();
  const [menuByCategory, setMenuByCategory] = useState<
    MenuResponse["categories"]
  >([]);
  const [search, setSearch] = useState("");

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
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          backgroundColor: choosedTheme.secondary,
          paddingRight: 25,
        }}
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
          text={cart.item.length.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
