import { CartData, CartMenuItem } from "@/src/models/cart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CartStore = {
  order: CartData;

  setTableId: (tableId: string) => void;
  setCustomerNote: (note: string) => void;

  addItem: (item: CartMenuItem) => void;

  removeItem: (id: string) => void;

  updateItemQuantity: (id: string, quantity: number) => void;

  clearCart: () => void;
};

const initialOrder: CartData = {
  table_id: "",
  item: [],
  customer_note: "",
};

export const useCartStore = create<CartStore>()(
  persist(
  (set) => ({
    order: initialOrder,

    setTableId: (tableId) =>
      set((state) => ({
        order: {
          ...state.order,
          table_id: tableId,
        },
      })),

    setCustomerNote: (note) =>
      set((state) => ({
        order: {
          ...state.order,
          customer_note: note,
        },
      })),

    addItem: (newItem) =>
      set((state) => {
        const existingItem = state.order.item.find(
          (item) =>
            item.menu_item_id === newItem.menu_item_id &&
            JSON.stringify(item.customizations) ===
              JSON.stringify(newItem.customizations)
        );

        if (existingItem) {
          return {
            order: {
              ...state.order,
              item: state.order.item.map((item) =>
                item === existingItem
                  ? {
                      ...item,
                      quantity: item.quantity + newItem.quantity,
                    }
                  : item
              ),
            },
          };
        }

        return {
          order: {
            ...state.order,
            item: [...state.order.item, newItem],
          },
        };
      }),

    removeItem: (id) =>
      set((state) => ({
        order: {
          ...state.order,
          item: state.order.item.filter((item) => item.id !== id),
        },
      })),

    updateItemQuantity: (id, quantity) =>
      set((state) => ({
        order: {
          ...state.order,
          item: state.order.item.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity,
                  total_price:
                    (item.price +
                      item.customizations.reduce(
                        (sum, c) => sum + (c.price_modifier || 0),
                        0
                      )) *
                    quantity,
                }
              : item
          ),
        },
      })),

    clearCart: () =>
      set((state) => ({
        order: {
          ...state.order,
          item: [],
          customer_note: "",
        },
      })),
  })
    ,{
      name: "cart-storage",
      storage: createJSONStorage(() =>
        Platform.OS === "web" ? localStorage : AsyncStorage
      ),
    }
  )
);
