type Restaurant = {
  id: string;
  name: string;
  table_id: string;
};

type MenuCategory = {
  id: number;
  name: string;
  sort_order: number;
  items?: MenuItem[];
};

type CustomizationOption = { id: number; name: string; price_modifier: number };

type Customization = {
  id: number;
  name: string;
  required: boolean;
  max_selections: number;
  options: CustomizationOption[];
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  customization_groups: Customization[];
};

export type MenuResponse = {
  restaurant: Restaurant;
  categories: MenuCategory[];
  items: MenuItem[];
};
