export type CartCustomizationsOption = {
  option_id: number;
  quantity: number;
  price_modifier: number;
  name: string;
  group_name: string;
};

export type CartMenuItem = {
  menu_item_id: number;
  quantity: number;
  customizations: CartCustomizationsOption[];
  price: number;
  category_id:number;
  name: string;
  total_price: number;
};

export type CartData = {
  table_id: string;
  item: CartMenuItem[];
  customer_note: string;
};

export type CartCategory = {
  id: number;
  name: string;
  sort_order: number;
  items?: CartMenuItem[];
};
