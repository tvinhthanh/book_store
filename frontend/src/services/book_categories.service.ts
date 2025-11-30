/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const bookCategoriesApi = {
    getByBook: (bookId: string) => request(`/api/book_categories/${bookId}`),
    link: (data: any) => request("/api/book_categories", { method: "POST", body: JSON.stringify(data) }),
    unlink: (data: any) => request("/api/book_categories", { method: "DELETE", body: JSON.stringify(data) }),
};
