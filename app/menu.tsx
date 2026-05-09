import { api } from "@/src/api/apiMiddleware";
import AddButton from "@/src/components/button/add-menu-button";
import { choosedTheme } from "@/src/constants/theme";
import { MenuResponse } from "@/src/models/menuResponse";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function MenuScreen() {
  const [menuByCategory, setMenuByCategory] = useState<
    MenuResponse["categories"]
  >([]);
  const [search, setSearch] = useState("");

  const { tableId } = useLocalSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["todos", tableId],
    queryFn: () => api.getMenuForATable(tableId.toString()),
  });

  useEffect(() => {
    if (data) {
      const categories = data?.data?.categories || [];
      categories.forEach((category: any) => {
        category.items = data?.data?.items.filter(
          (item: any) => item.category_id === category.id
        );
      });
      setMenuByCategory(categories);
    }
  }, [data]);

  const filteredMenu = menuByCategory.map((category) => ({
    ...category,
    items: category?.items?.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  //for changing

  return (
    <View style={{ flex: 1, backgroundColor: choosedTheme.background }}>
      <Stack.Screen
        options={{ title: "Menu at " + data?.data?.restaurant.name }}
      />
      <TextInput
        placeholder="Search menu..."
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
            <Text style={{ fontSize: 18, fontWeight: "bold", margin: 10 }}>
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
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  <Text style={{ color: "gray" }}>{item.description}</Text>
                  <Text>Rp {item.price}</Text>
                </View>
                <AddButton
                  onPress={() => console.log("Add item with id:", item.id)}
                />
              </View>
            ))}
            {category?.items?.length === 0 && (
              <Text style={{ padding: 10, color: "gray" }}>-</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
