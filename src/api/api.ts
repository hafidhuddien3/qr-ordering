// Method	Endpoint	Description
// GET	/api/v1/menu?table_id={id}	Get menu for a table
// GET	/api/v1/categories	List menu categories
// POST	/api/v1/orders	Create new order
// GET	/api/v1/orders/{id}	Get order status
// GET	/api/v1/tables/{id}/status	Get table status

import { MenuResponse } from "../models/menuResponse";
import { ResponseBase } from "../models/responseBase";
import { request } from "./axiosClient";

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
  async getListMenuCategories() {
    return await request({
      url: "/categories",
    });
  },

  // POST	/api/v1/orders	Create new order
  async postOrder(dataPost: OrderData) {
    return await request({
      method: "POST",
      url: "/orders",
      data: dataPost,
    });
  },

  // GET	/api/v1/orders/{id}	Get order status
  async getOrderStatus(id: string) {
    return await request({
      url: "/orders/" + id,
    });
  },

  // GET	/api/v1/tables/{id}/status	Get table status
  async getTablestatus(id: string) {
    return await request({
      url: `/tables/${id}/status`,
    });
  },
};
