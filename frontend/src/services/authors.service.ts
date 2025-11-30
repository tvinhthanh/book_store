/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const authorsApi = {
    getAll: () =>
        request("/api/authors", {
            method: "GET",
            credentials: "include",
        }),

    getById: (id: string) =>
        request(`/api/authors/${id}`, {
            method: "GET",
            credentials: "include",
        }),

    create: (data: any) =>
        request("/api/authors", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
        }),

    update: (id: string, data: any) =>
        request(`/api/authors/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            credentials: "include",
        }),

    delete: (id: string) =>
        request(`/api/authors/${id}`, {
            method: "DELETE",
            credentials: "include",
        }),
};
