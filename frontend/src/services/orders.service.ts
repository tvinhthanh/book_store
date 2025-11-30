/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const ordersApi = {
  getAll: () => request("/api/orders"),
  getById: (id: string) => request(`/api/orders/${id}`),
  create: (data: any) => request("/api/orders", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/api/orders/${id}`, { method: "DELETE" }),
};
