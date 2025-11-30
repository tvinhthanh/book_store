/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const booksApi = {
    getAll: () => fetch(API_BASE_URL + "/api/books").then(r => r.json()),

    create: async (data: any) => {
        const form = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (value instanceof Blob) {
                    form.append(key, value);
                } else {
                    form.append(key, String(value));
                }
            }
        });

        const res = await fetch(API_BASE_URL + "/api/books", {
            method: "POST",
            body: form,
            credentials: "include"
        });

        if (!res.ok) throw new Error("Create failed");

        return res.json();
    },

    update: async (id: string, data: any) => {
        const form = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (value !== null && value !== undefined) {
                if (value instanceof Blob) {
                    form.append(key, value);
                } else {
                    form.append(key, String(value));
                }
            }
        });

        const res = await fetch(API_BASE_URL + `/api/books/${id}`, {
            method: "PUT",
            body: form,
            credentials: "include"
        });

        return res.json();
    },

    delete: (id: string) =>
        fetch(API_BASE_URL + `/api/books/${id}`, {
            method: "DELETE",
            credentials: "include"
        }).then(r => r.json()),

    getByID: (id: string) => fetch(API_BASE_URL + `/api/books/${id}`).then(r => r.json()),
};
