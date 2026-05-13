import { CartData } from "./cart";

 type OrderCustomizationsOption = {
  option_id: number;
  quantity: number;
  price_modifier: number;
  name: string;
  group_name: string;
};

 type OrderMenuItem = {
  id: string;
  menu_item_id: number;
  quantity: number;
  customizations: OrderCustomizationsOption[];
  price: number;
  category_id:number;
  name: string;
  total_price: number;
};

export type APIOrderData = {
  table_id: string;
  item: OrderMenuItem[];
  customer_note: string;
  estimated_time: number;
  status: string;
  meta: CartData;
  remarks: string;
};

type OrderCategory = {
  id: number;
  name: string;
  sort_order: number;
  items?: OrderMenuItem[];
};
