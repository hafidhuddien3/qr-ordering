// Method	Endpoint	Description
// GET	/api/v1/menu?table_id={id}	Get menu for a table
// GET	/api/v1/categories	List menu categories
// POST	/api/v1/orders	Create new order
// GET	/api/v1/orders/{id}	Get order status
// GET	/api/v1/tables/{id}/status	Get table status

import { MenuCategory, MenuResponse } from "../models/menuResponse";
import { OrderData } from "../models/order";
import { APIOrderData } from "../models/ordersFromAPI";
import { ResponseBase } from "../models/responseBase";
import { request } from "./axiosClient";


export const apiService = {
  // GET	/api/v1/menu?table_id={id}	Get menu for a table
  async getMenuForATable(tableId: string): Promise<ResponseBase<MenuResponse>> {
    return await request({
      url: "/menu",
      params: {
        table_id: tableId,
      },
    });
  },

  // GET	/api/v1/categories	List menu categories
  async getListMenuCategories(): Promise<ResponseBase<MenuCategory[]>> {
    return await request({
      url: "/categories",
    });
  },

  // POST	/api/v1/orders	Create new order
  async postOrder(dataPost: OrderData): Promise<ResponseBase<{ id: string }>> {
    return await request({
      method: "POST",
      url: "/orders",
      data: dataPost,
    });
  },

  // GET	/api/v1/orders/{id}	Get order status
  async getOrderStatus(id: string): Promise<ResponseBase<APIOrderData[]>> {
    return await request({
      url: "/orders/" + id,
    });
  },

  // GET	/api/v1/tables/{id}/status	Get table status
  async getTablestatus(id: string): Promise<ResponseBase<any>> {
    return await request({
      url: `/tables/${id}/status`,
    });
  },
};
