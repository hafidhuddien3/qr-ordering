export type OrderCustomizationsOption = { option_id: number; quantity: number };

export type OrderMenuItem = {
  menu_item_id: number;
  quantity: number;
  customizations: OrderCustomizationsOption[];
};

export type OrderData = {
  table_id: string;
  item: OrderMenuItem[];
  customer_note: string;
};

export type OrderStatus = "Pending" | "Confirmed" | "Preparing" | "Ready" | "Served";