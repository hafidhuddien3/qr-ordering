import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { api } from "@/src/api/apiMiddleware";
import IonIconButton from "@/src/components/button/ion-icon-button";
import OrderStatusStepper from "@/src/components/order-status";
import ParallaxScrollView from "@/src/components/parallax-scroll-view";
import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { choosedTheme } from "@/src/constants/theme";
import { CartCategory } from "@/src/models/cart";
import { APIOrderData } from "@/src/models/ordersFromAPI";
import { ResponseBase } from "@/src/models/responseBase";
import { calculateTotal } from "@/src/utils/cart";
import { useQueries, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function OrderTrackingScreen() {
  const { t } = useTranslation();
  const { tableId } = useLocalSearchParams();

  const [menuByCategory, setMenuByCategory] = useState<CartCategory[]>([]);
  const [now, setNow] = useState(Date.now());

  const { data: dataTableStatus, isLoading: isLoadingTableStatus } = useQuery({
    queryKey: ["table-status", tableId],
    queryFn: () => api.getTablestatus(tableId.toString()),
    refetchOnWindowFocus: false,
  });

  const orderIds = dataTableStatus?.data?.active_order_ids || [];

  const orderQueries = useQueries({
    queries: orderIds.map((id: number) => ({
      queryKey: ["order-status", id],
      queryFn: () => api.getOrderStatus(id.toString()),
      enabled: !!id,
      refetchInterval: 15000,
      refetchIntervalInBackground: false,
    })),
  });

  const { data: dataCategories, isLoading } = useQuery({
    queryKey: ["categories", tableId],
    queryFn: () => api.getListMenuCategories(),
  });

  const orders = orderQueries.map(
    (query) => query?.data
  ) as ResponseBase<APIOrderData>[];

  const isLoadingOrderStatus = orderQueries.some((query) => query.isLoading);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const estimatedTime = new Date(
    orders?.[0]?.data?.estimated_time || ""
  ).getTime();

  const diffMs = Math.max(estimatedTime - now, 0);

  const minutes = Math.floor(diffMs / 1000 / 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  const totalPrice = useMemo(() => {
    if (!orders[0]?.data?.cart) return 0;
    return calculateTotal(orders[0]?.data?.cart);
  }, [orders?.[0]?.data?.cart]);

  useEffect(() => {
    if (orders[0]?.data?.cart) {
      const newCategories: CartCategory[] =
        dataCategories?.data?.map((category) => ({
          id: category.id,
          name: category.name,
          sort_order: category.sort_order,
        })) || [];
      newCategories.map((category) => {
        category.items = orders[0]?.data?.cart.item.filter(
          (item) => item.category_id === category.id
        );
      });
      setMenuByCategory(newCategories);
    }
  }, [orders[0]?.data?.cart]);

  if (isLoadingTableStatus || isLoadingOrderStatus || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={choosedTheme.primary} />
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  if (orders.length == 0) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{
          light: "white",
          dark: choosedTheme.secondary + "80",
        }}
        headerImage={
          <View
            style={{
              marginVertical: 100,
              marginHorizontal: 5,
            }}
          >
            <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
              {t("no_pending_order")}
            </ThemedText>
          </View>
        }
      >
        <ThemedView style={styles.stepContainer}>
          <View
            style={{
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <IonIconButton
              iconName="home"
              text={t("back_to_home")}
              onPress={() => router.replace("/")}
            />
          </View>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: "white",
        dark: "white",
      }}
      headerImage={
        <View
          style={{
            marginVertical: 40,
            marginHorizontal: 5,
          }}
        >
          <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
            {orders[0]?.data?.status == "Served"
              ? t("enjoy_meal")
              : `${t("estimated_time")} : ${minutes}m ${seconds}s`}
          </ThemedText>
          <OrderStatusStepper currentStatus={orders[0]?.data?.status || ""} />
        </View>
      }
    >
      <View
        style={{
          backgroundColor: choosedTheme.secondary + "20",
          borderRadius: 8,
          flex: 1,
          paddingTop: 10,
          paddingHorizontal: 10,
          paddingBottom: 50,
        }}
      >
        <ThemedView style={styles.titleContainer}></ThemedView>
        <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
          {t("order_id") + `: ${orderIds.join(", ")}`}
        </ThemedText>

        <ScrollView>
          {menuByCategory.map((category) => {
            return (
              category?.items?.length !== 0 && (
                <View key={category.id}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      margin: 10,
                      marginBottom: 5,
                    }}
                  >
                    {category.name}
                  </Text>

                  {category?.items?.map((item) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        backgroundColor: choosedTheme.secondary + "10",
                        borderRadius: 8,
                      }}
                      key={item.menu_item_id}
                    >
                      <View
                        key={item.menu_item_id}
                        style={{
                          padding: 10,
                          borderBottomWidth: 1,
                          borderColor: "#eee",
                          gap: 3,
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                        {item.customizations
                          .map(
                            (custom) => custom.group_name + " : " + custom.name
                          )
                          .map((customText, index) => (
                            <Text key={index} style={{ color: "gray" }}>
                              {customText}
                            </Text>
                          ))}
                        <Text>
                          USD {item.price} +{" "}
                          {(
                            item.total_price / item.quantity -
                            item.price
                          ).toFixed(2)}
                        </Text>
                      </View>
                      <View style={{ width: "40%", paddingTop: 10, gap: 10 }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <Text style={{ fontWeight: 500 }}>
                            USD {item.total_price.toFixed(2)}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <Text style={{ fontSize: 16 }}>
                            {item.quantity} pcs
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  {category?.items?.length === 0 && (
                    <Text style={{ padding: 10, color: "gray" }}>-</Text>
                  )}
                </View>
              )
            );
          })}
          {orders[0]?.data?.remarks && (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  margin: 10,
                  marginBottom: 0,
                }}
              >
                {t("customer_note")}
              </Text>
              <Text
                style={{
                  padding: 10,
                  borderRadius: 8,
                  margin: 5,
                  marginBottom: 20,
                  borderColor: choosedTheme.primary,
                }}
              >
                {orders[0]?.data?.remarks}
              </Text>
            </>
          )}
        </ScrollView>
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
              {t("total")} USD {totalPrice?.toFixed(2) || "0.00"}
            </Text>
          </View>
        </View>
      </View>

      <ThemedView style={styles.stepContainer}>
        <View
          style={{ padding: 5, justifyContent: "center", alignItems: "center" }}
        >
          <IonIconButton
            iconName="home"
            text={t("back_to_home")}
            onPress={() => router.replace("/")}
          />
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
