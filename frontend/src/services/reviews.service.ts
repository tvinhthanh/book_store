/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const reviewsApi = {
    getAll: () => request("/api/reviews"),
    getByBook: (bookId: string) => request(`/api/reviews/book/${bookId}`),
    create: (data: any) => request("/api/reviews", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/reviews/${id}`, { method: "DELETE" }),
};
