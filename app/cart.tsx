import { api } from "@/src/api/apiMiddleware";
import IonIconButton from "@/src/components/button/ion-icon-button";
import { choosedTheme } from "@/src/constants/theme";
import { CartCategory } from "@/src/models/cart";
import { useCartStore } from "@/src/state/stores/useCartStore";
import { useCategoryStore } from "@/src/state/stores/useCategoryStore";
import { utilsConfirm } from "@/src/utils/confirm";
import { router, Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function CartScreen() {
  const [menuByCategory, setMenuByCategory] = useState<CartCategory[]>([]);
  const [note, setNote] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  const cart = useCartStore((state) => state.order);
  const categories = useCategoryStore((state) => state.categories);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

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
        message: "Remove this item from cart?",
        isDestructiveStyle: true,
        onConfirm: () => removeItem(id),
      });
    } else {
      updateItemQuantity(id, newQuantity);
    }
  };

  const onOrder = () => {
    if (cart.item.length === 0) return alert("Cart is empty");
    cart.customer_note = note;
    utilsConfirm({
      message: "Order now?",
      isDestructiveStyle: true,
      onConfirm: () => {
        setOrderLoading(true);
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
              "Failed to place order. Please try again.\nError: " +
                (err?.message || "Unknown error")
            );
          });
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: choosedTheme.background }}>
      <Stack.Screen options={{ title: "Cart for Table ID " + cart.table_id }} />

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
                    <View style={{  paddingTop: 10, gap: 10, width: '50%' }}>
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
                          iconName={"remove"}
                          onPress={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          padding={3}
                        />
                        <Text style={{ fontSize: 16 }}>{item.quantity} pcs</Text>
                        <IonIconButton
                          iconName={"add"}
                          onPress={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity + 1
                            )
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
          Customer Note
        </Text>
        <TextInput
          placeholder="Customer note..."
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
            Total USD {totalPrice.toFixed(2)}
          </Text>
        </View>
        <IonIconButton text={"Order"} onPress={onOrder} loading={orderLoading} />
      </View>
    </View>
  );
}
