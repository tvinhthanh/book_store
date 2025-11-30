/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const orderItemsApi = {
  getAll: () => request("/api/order_items"),
  getById: (id: string) => request(`/api/order_items/${id}`),
  create: (data: any) => request("/api/order_items", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/api/order_items/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/api/order_items/${id}`, { method: "DELETE" }),
};
