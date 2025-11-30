/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const usersApi = {
    login: (data: any) =>
        request("/api/users/login", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
        }),

    register: (data: any) =>
        request("/api/users/", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
        }),

    logout: () =>
        request("/api/users/logout", {
            method: "POST",
            credentials: "include",
        }),

    getMe: () =>
        request("/api/users/me", {
            method: "GET",
            credentials: "include",
        }),

    getUser: (id: string) =>
        request(`/api/users/${id}`, {
            method: "GET",
            credentials: "include",
        }),

    getAll: () =>
        request("/api/users", {
            method: "GET",
            credentials: "include",
        }),

    update: (id: string, data: any) =>
        request(`/api/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            credentials: "include",
        }),

    delete: (id: string) =>
        request(`/api/users/${id}`, {
            method: "DELETE",
            credentials: "include",
        }),
};
