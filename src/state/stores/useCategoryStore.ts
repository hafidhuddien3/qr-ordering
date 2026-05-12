import { MenuCategory } from "@/src/models/menuResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CategoryStore = {
  categories: MenuCategory[];
  setCategories: (categories: MenuCategory[]) => void;
};

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories: MenuCategory[]) => set({ categories }),
    }),
    {
      name: "categories-storage",
      storage: createJSONStorage(() =>
        Platform.OS === "web" ? localStorage : AsyncStorage
      ),
    }
  )
);
