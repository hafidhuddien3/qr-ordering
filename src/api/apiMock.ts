// Method	Endpoint	Description
// GET	/api/v1/menu?table_id={id}	Get menu for a table
// GET	/api/v1/categories	List menu categories
// POST	/api/v1/orders	Create new order
// GET	/api/v1/orders/{id}	Get order status
// GET	/api/v1/tables/{id}/status	Get table status

import { MenuCategory, MenuResponse } from "../models/menuResponse";
import { APIOrderData } from "../models/ordersFromAPI";
import { ResponseBase } from "../models/responseBase";
import { dataMock } from "./dataMock";

type Customizations = { option_id: number; quantity: number };

type MenuItem = {
  menu_item_id: number;
  quantity: number;
  customizations: Customizations[];
};

type OrderData = {
  table_id: string;
  item: MenuItem[];
  customer_note: string;
};

const orders: any[] = [];

const responseSuccess = (data: any) => {
  return {
    success: true,
    message: "Request successful",
    data,
  };
};

const responseFailed = (message: string) => {
  return {
    success: false,
    message: message,
    errors: {},
  };
};

export const apiService = {
  // GET	/api/v1/menu?table_id={id}	Get menu for a table
  async getMenuForATable(tableId: string): Promise<ResponseBase<MenuResponse>> {
    if (tableId !== "T001") return responseFailed("Table ID not found");
    return responseSuccess(dataMock.menuTableIdT001);
  },

  // GET	/api/v1/categories	List menu categories
  async getListMenuCategories(): Promise<ResponseBase<MenuCategory[]>> {
    return responseSuccess(dataMock.categories);
  },

  // POST	/api/v1/orders	Create new order
  async postOrder(dataPost: OrderData) {
    const minutes = 5;
    const id = new Date().toISOString();
    orders.push({
      id: id,
      table_id: dataPost.table_id,
      remarks: dataPost.customer_note,
      status: "Preparing",
      estimated_time: new Date(Date.now() + minutes * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      meta: dataPost,
    });

    return responseSuccess({
      order_id: id,
    });
  },

  // GET	/api/v1/orders/{id}	Get order status
  async getOrderStatus(id: string): Promise<ResponseBase<APIOrderData[]>> {
    const myOrder = orders.find((order) => order.id === id);
    const status = getOrderStatus(myOrder.created_at, myOrder.estimated_time);
    return responseSuccess({
      ...myOrder,
      status: status,
    });
  },

  // GET	/api/v1/tables/{id}/status	Get table status
  async getTablestatus(id: string): Promise<ResponseBase<any>> {
    const myOrders = orders.filter((order) => order.table_id === id);
    const ids = myOrders.map((order: any) => order.id);
    return await responseSuccess({
      table_id: id,
      status: "Occupied",
      active_order_ids: ids,
    });
  },
};

function getOrderStatus(created_at: Date, estimatedTime: Date) {
  const statuses = ["Pending", "Confirmed", "Preparing", "Ready", "Served"];

  const start = new Date(created_at).getTime();
  const end = new Date(estimatedTime).getTime();
  const now = Date.now();

  const totalDuration = end - start;
  const elapsed = now - start;

  const progress = elapsed / totalDuration;

  const index = Math.min(
    Math.floor(progress * statuses.length),
    statuses.length - 1
  );

  return statuses[index];
}
