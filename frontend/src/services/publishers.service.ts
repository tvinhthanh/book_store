/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const publishersApi = {
    getAll: () => request("/api/publishers"),
    getById: (id: string) => request(`/api/publishers/${id}`),
    create: (data: any) => request("/api/publishers", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/publishers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/publishers/${id}`, { method: "DELETE" }),
};
