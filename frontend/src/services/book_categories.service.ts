/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "./api-client";

export const bookCategoriesApi = {
  getByBook: (bookId: string) => request(`/api/book_categories/${bookId}`),
  getBooksByCategory: (categoryId: string) =>
    request(`/api/book-categories/category/${categoryId}`),
  link: (data: any) =>
    request("/api/book-categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  unlink: (data: any) =>
    request("/api/book-categories", {
      method: "DELETE",
      body: JSON.stringify(data),
    }),
};
