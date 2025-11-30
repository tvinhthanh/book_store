/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const bookAuthorsApi = {
    getByBook: (bookId: string) => request(`/api/book_authors/${bookId}`),
    link: (data: any) => request("/api/book_authors", { method: "POST", body: JSON.stringify(data) }),
    unlink: (data: any) => request("/api/book_authors", { method: "DELETE", body: JSON.stringify(data) }),
};
