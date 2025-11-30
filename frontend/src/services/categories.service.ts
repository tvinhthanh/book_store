/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const categoriesApi = {
    getAll: () => request("/api/categories"),
    getById: (id: string) => request(`/api/categories/${id}`),
    create: (data: any) =>
        request("/api/categories", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: string, data: any) =>
        request(`/api/categories/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        request(`/api/categories/${id}`, {
            method: "DELETE",
        }),
};
