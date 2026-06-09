import { MenuCategory } from "@/src/models/menuResponse";
import { create } from "zustand";

type CategoryStore = {
  categories: MenuCategory[];
  setCategories: (categories: MenuCategory[]) => void;
};

export const useCategoryStore = create<CategoryStore>()(
  // persist(
    (set) => ({
      categories: [],
      setCategories: (categories: MenuCategory[]) => set({ categories }),
    })
  //   ,
  //   {
  //     name: "categories-storage",
  //     storage: createJSONStorage(() =>
  //       Platform.OS === "web" ? localStorage : AsyncStorage
  //     ),
  //   }
  // )
);
