import { CartData } from "@/src/models/cart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Order = {
  id: string;
  orderData: CartData;
  status: "PENDING_SYNC" | "SYNCED";
};

type OrderStore = {
  queue: Order[];
  addOrder: (order: Order) => void;
  removeOrder: (id: string) => void;
  clear: () => void;
};

export const useOrderQueue = create<OrderStore>()(
  persist(
    (set) => ({
      queue: [],

      addOrder: (order) =>
        set((state) => ({
          queue: [...state.queue, order],
        })),

      removeOrder: (id) =>
        set((state) => ({
          queue: state.queue.filter((o) => o.id !== id),
        })),

      clear: () => set({ queue: [] }),
    }),
    {
      name: "order-queue",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);