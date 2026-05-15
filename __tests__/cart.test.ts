import { useCartStore } from "@/src/state/stores/useCartStore";
import { calculateTotal } from "@/src/utils/cart";

const sampleCart = {
  table_id: "T001",
  item: [
    {
      id: "1778756160220",
      menu_item_id: 1,
      quantity: 1,
      customizations: [
        {
          option_id: 2,
          quantity: 1,
          price_modifier: 1.5,
          name: "Truffle Salt",
          group_name: "Seasoning",
        },
        {
          option_id: 1,
          quantity: 1,
          price_modifier: 0,
          name: "Sea Salt",
          group_name: "Seasoning",
        },
      ],
      price: 5.99,
      category_id: 1,
      name: "Edamame",
      total_price: 7.49,
    },
    {
      id: "1778756164867",
      menu_item_id: 2,
      quantity: 1,
      customizations: [
        {
          option_id: 5,
          quantity: 1,
          price_modifier: 8,
          name: "Large (12pc)",
          group_name: "Size",
        },
      ],
      price: 16.99,
      category_id: 2,
      name: "Salmon Sashimi",
      total_price: 24.99,
    },
  ],
  customer_note: "",
};

export const sampleCartStore = {
    id: "1",
    menu_item_id: 2,
    quantity: 2,
    customizations: [],
    price: 12,
    category_id: 3,
    name: "Pizza",
    total_price: 24,
  }

test("calculates cart total correctly", () => {
  expect(calculateTotal(sampleCart)).toBe(32.48);
});

test("increases quantity", () => {
  const store = useCartStore.getState();

  store.clearCart();

  store.addItem(sampleCartStore);

  store.updateItemQuantity("1", 3);

  const updated = useCartStore.getState();

  expect(updated.order.item[0].quantity).toBe(3);
});