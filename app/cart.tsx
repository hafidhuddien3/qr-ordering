import { api } from "@/src/api/apiMiddleware";
import IonIconButton from "@/src/components/button/ion-icon-button";
import { OfflineIndicator } from "@/src/components/offline-indicator";
import { choosedTheme } from "@/src/constants/theme";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { CartCategory } from "@/src/models/cart";
import { useCartStore } from "@/src/state/stores/useCartStore";
import { useCategoryStore } from "@/src/state/stores/useCategoryStore";
import { useOrderQueue } from "@/src/state/stores/useOrderQueue";
import { calculateTotal } from "@/src/utils/cart";
import { utilsConfirm } from "@/src/utils/confirm";
import { router, Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const { t } = useTranslation();
  const [menuByCategory, setMenuByCategory] = useState<CartCategory[]>([]);
  const [note, setNote] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  const cart = useCartStore((state) => state.order);
  const categories = useCategoryStore((state) => state.categories);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderQueue((state) => state.addOrder);
  const { isOffline } = useNetworkStatus();

  const totalPrice = useMemo(() => {
    return calculateTotal(cart);
  }, [cart]);

  useEffect(() => {
    if (cart) {
      const newCategories: CartCategory[] = categories.map((category) => ({
        id: category.id,
        name: category.name,
        sort_order: category.sort_order,
      }));
      newCategories.map((category) => {
        category.items = cart.item.filter(
          (item) => item.category_id === category.id
        );
      });
      setMenuByCategory(newCategories);
    }
  }, [cart]);

  //for changing quantity
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      utilsConfirm({
        message: t("remove_item_confirm"),
        isDestructiveStyle: true,
        onConfirm: () => removeItem(id),
      });
    } else {
      updateItemQuantity(id, newQuantity);
    }
  };

  const onOrder = () => {
    if (cart.item.length === 0) return alert(t("cart_empty"));
    cart.customer_note = note;
    utilsConfirm({
      message: t("order_now_confirm"),
      isDestructiveStyle: false,
      onConfirm: () => {
        setOrderLoading(true);
        if (isOffline) {
          setOrderLoading(false);
          addOrder({
            id: "temp-" + Date.now(),
            orderData: cart,
            status: "PENDING_SYNC",
          });
          clearCart();
          router.replace(`/order-tracking?tableId=${cart.table_id}`);
          return;
        }
        api
          .postOrder(cart)
          .then((res: any) => {
            setOrderLoading(false);
            if (res?.data?.id) {
              clearCart();
              router.replace(`/order-tracking?tableId=${cart.table_id}`);
            }
          })
          .catch((err) => {
            setOrderLoading(false);
            alert(
              t("place_order_failed") +
                "\nError: " +
                (err?.message || "Unknown error")
            );
          });
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: choosedTheme.background }}>
      <Stack.Screen
        options={{ title: t("cart_table_id") + " " + cart.table_id }}
      />

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
                    marginBottom: 0,
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
                    <View style={{ paddingTop: 10, gap: 10, width: "50%" }}>
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
                        <IonIconButton
                          accessibilityLabel={"decrease_quantity"}
                          iconName={"remove"}
                          onPress={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          padding={3}
                        />
                        <Text style={{ fontSize: 16 }}>
                          {item.quantity} pcs
                        </Text>
                        <IonIconButton
                          accessibilityLabel={"increase_quantity"}
                          iconName={"add"}
                          testID="add-button"
                          onPress={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          padding={3}
                        />
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
        <TextInput
          accessibilityLabel={t("customer_note_placeholder")}
          placeholder={t("customer_note_placeholder")}
          placeholderTextColor={"gray"}
          value={note}
          onChangeText={setNote}
          style={{
            padding: 10,
            borderWidth: 1,
            borderRadius: 8,
            margin: 10,
            borderColor: choosedTheme.primary,
          }}
        />
        <View style={{ padding: 20, width: "50%" }}>
          <IonIconButton
            accessibilityLabel={"clear_cart"}
            iconName="trash"
            text={"Clear Cart"}
            onPress={() =>
              utilsConfirm({
                message: "Clear Cart?",
                isDestructiveStyle: true,
                onConfirm: () => clearCart(),
              })
            }
          />
        </View>
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
            {t("total")} USD {totalPrice.toFixed(2)}
          </Text>
        </View>
        <IonIconButton
          accessibilityLabel={t("order")}
          text={t("order")}
          onPress={onOrder}
          loading={orderLoading}
        />
      </View>
    </SafeAreaView>
  );
}
