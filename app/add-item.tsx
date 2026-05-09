import { cacheObject } from "@/src/cache/cache";
import { Radio } from "@/src/components/radio";
import { CustomizationOption } from "@/src/models/menuResponse";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function CustomizeScreen() {
  const item = cacheObject.currentMenuItem
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    [groupId: number]: CustomizationOption[];
  }>({});

  // calculate price
  const totalPrice = useMemo(() => {
    let price = item?.price || 0;

    Object.values(selectedOptions).forEach((opts: any) => {
      opts?.forEach((o: any) => {
        price += o.price_modifier || 0;
      });
    });

    return price * quantity;
  }, [selectedOptions, quantity]);

  const toggleOption = (
    groupId: number,
    option: CustomizationOption,
    maxSelections: number
  ) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];

      const exists = current.find((o) => o.id === option.id);

      if (exists) {
        return {
          ...prev,
          [groupId]: current.filter((o) => o.id !== option.id),
        };
      }

      if (1 == maxSelections) {
        return {
          ...prev,
          [groupId]: [option],
        };
      }

      if (current.length >= maxSelections) return prev;

      return {
        ...prev,
        [groupId]: [...current, option],
      };
    });
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* ITEM INFO */}
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{item?.name}</Text>

      <Text style={{ marginTop: 4, color: "#666" }}>{item?.description}</Text>

      <Text style={{ marginTop: 10, fontSize: 18 }}>
        Base: ${item?.price.toFixed(2)}
      </Text>

      {/* CUSTOMIZATION */}
      {item?.customization_groups.map((group) => (
        <View key={group.id} style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {group.name}
            {group.required ? " *" : ""}
            {" (max " + group.max_selections + ")"}
          </Text>

          {group.options.map((opt) => {
            const selected = selectedOptions[group.id]?.some(
              (o) => o.id === opt.id
            );

            return (
              <Pressable
                key={opt.id}
                onPress={() =>
                  toggleOption(group.id, opt, group.max_selections)
                }
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                }}
              >
                <Text>{opt.name}</Text>

                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  {opt.price_modifier > 0 ? (
                    <Text style={{ textAlign: "right" }}>
                      +${opt.price_modifier}
                    </Text>
                  ) : (
                    <Text style={{ textAlign: "right" }}>Free</Text>
                  )}
                  <Radio selected={selected} />
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      {/* QUANTITY */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 30,
        }}
      >
        <Text style={{ fontSize: 16 }}>Quantity</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Ionicons name="remove-circle" size={28} color="#C62828" />
          </Pressable>

          <Text style={{ fontSize: 18 }}>{quantity}</Text>

          <Pressable onPress={() => setQuantity((q) => q + 1)}>
            <Ionicons name="add-circle" size={28} color="#2E7D32" />
          </Pressable>
        </View>
      </View>

      {/* TOTAL */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Total: ${totalPrice.toFixed(2)}
        </Text>
      </View>

      {/* ADD TO CART */}
      <Pressable
        style={{
          marginTop: 20,
          backgroundColor: "#2E7D32",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={() => {
          // validate required groups
          for (const group of item?.customization_groups || []) {
            if (
              group.required &&
              (!selectedOptions[group.id] ||
                selectedOptions[group.id].length === 0)
            ) {
              alert(`Please select at least one option for "${group.name}"`);
              return;
            }
          }
          // add to cart
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Add to Cart</Text>
      </Pressable>
    </ScrollView>
  );
}
