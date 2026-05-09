// Method	Endpoint	Description
// GET	/api/v1/menu?table_id={id}	Get menu for a table
// GET	/api/v1/categories	List menu categories
// POST	/api/v1/orders	Create new order
// GET	/api/v1/orders/{id}	Get order status
// GET	/api/v1/tables/{id}/status	Get table status

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
    message: "Request successful",
    errors: {},
  };
};

export const apiService = {
  // GET	/api/v1/menu?table_id={id}	Get menu for a table
  async getMenuForATable(tableId: string) {
    if (tableId !== "T001") return responseFailed("Table not found");
    return responseSuccess(dataMock.menuTableIdT001);
  },

  // GET	/api/v1/categories	List menu categories
  async getListMenuCategories() {
    return responseSuccess(dataMock.categories);
  },

  // POST	/api/v1/orders	Create new order
  async postOrder(dataPost: OrderData) {
    return responseSuccess({
      order_id: "O12345",
      estimated_time: "20 minutes",
    });
  },

  // GET	/api/v1/orders/{id}	Get order status
  async getOrderStatus(id: string) {
    return responseSuccess({
      order_id: id,
      status: "In Progress",
      estimated_time: "15 minutes",
    });
  },

  // GET	/api/v1/tables/{id}/status	Get table status
  async getTablestatus(id: string) {
    return responseSuccess({
      table_id: id,
      status: "Occupied",
    });
  },
};
