/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { booksApi } from "../services/books.service";
import {
  AiOutlineArrowLeft,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";

interface Book {
  book_id: string;
  title: string;
  isbn?: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  publisher_id?: string;
  published_date?: string;
  language?: string;
  cover_image?: string;
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [inCart, setInCart] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery<Book>(["book", id], () => booksApi.getByID(id as string), {
    enabled: !!id,
  });

  // Đồng bộ trạng thái cart & favorites từ localStorage
  useEffect(() => {
    if (!book) return;
    const cartLS = JSON.parse(localStorage.getItem("cart") || "[]") as Book[];
    const favLS = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ) as Book[];

    setInCart(cartLS.some((b) => b.book_id === book.book_id));
    setFavorited(favLS.some((b) => b.book_id === book.book_id));
  }, [book]);

  const handleAddToCart = () => {
    if (!book) return;
    const cartLS = JSON.parse(localStorage.getItem("cart") || "[]") as Book[];

    if (!cartLS.some((b) => b.book_id === book.book_id)) {
      const updated = [...cartLS, book];
      localStorage.setItem("cart", JSON.stringify(updated));
      setInCart(true);
      alert("Đã thêm vào giỏ hàng!");
    }
  };

  const handleToggleFavorite = () => {
    if (!book) return;
    const favLS = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ) as Book[];

    if (favLS.some((b) => b.book_id === book.book_id)) {
      const updated = favLS.filter((b) => b.book_id !== book.book_id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setFavorited(false);
    } else {
      const updated = [...favLS, book];
      localStorage.setItem("favorites", JSON.stringify(updated));
      setFavorited(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-transparent">
        <p className="text-sm text-black">Đang tải chi tiết sách...</p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 bg-transparent">
        <p className="text-sm text-red-500">Không tìm thấy sách.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-orange-600 hover:underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <main className="bg-transparent min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-black hover:text-orange-600 transition-colors"
        >
          <AiOutlineArrowLeft />
          <span>Quay lại</span>
        </button>

        {/* card chi tiết */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
          <div className="flex flex-col lg:flex-row">
            {/* ảnh sách */}
            <div className="lg:w-2/5 bg-gray-50 flex items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-orange-200">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full max-w-xs rounded-xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-full max-w-xs aspect-[3/4] rounded-xl bg-gray-200 border-2 border-orange-200 flex items-center justify-center text-sm text-black">
                  Không có ảnh bìa
                </div>
              )}
            </div>

            {/* thông tin sách */}
            <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col gap-6">
              <div>
                <p className="text-xs tracking-[0.22em] uppercase text-orange-600/70 mb-2">
                  Book detail
                </p>
                <h1 className="text-2xl lg:text-3xl font-bold leading-snug text-black mb-2">
                  {book.title}
                </h1>
                {book.isbn && (
                  <p className="text-xs text-black/60 mt-1">
                    ISBN: {book.isbn}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-black/60 mb-1">Giá bán</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {book.price.toLocaleString()}đ
                  </p>
                </div>
                {typeof book.stock_quantity === "number" && (
                  <div>
                    <p className="text-xs text-black/60 mb-1">Tồn kho</p>
                    <p className="text-lg font-semibold text-black">
                      {book.stock_quantity > 0
                        ? `${book.stock_quantity} cuốn`
                        : "Hết hàng"}
                    </p>
                  </div>
                )}
              </div>

              {book.description && (
                <div>
                  <p className="text-sm font-semibold text-black mb-2">Giới thiệu</p>
                  <p className="text-sm text-black leading-relaxed max-h-48 overflow-y-auto pr-2">
                    {book.description}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium shadow-md transition-all ${
                    inCart
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105"
                  }`}
                >
                  <AiOutlineShoppingCart size={18} />
                  <span>{inCart ? "Đã trong giỏ" : "Thêm vào giỏ"}</span>
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                    favorited
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-orange-200 text-black hover:border-orange-400 hover:bg-orange-50"
                  }`}
                >
                  {favorited ? (
                    <AiFillHeart className="text-red-500" size={18} />
                  ) : (
                    <AiOutlineHeart size={18} />
                  )}
                  <span>
                    {favorited ? "Đã yêu thích" : "Thêm vào yêu thích"}
                  </span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-orange-200 flex flex-wrap gap-6 text-sm">
                {book.language && (
                  <div>
                    <span className="text-black/60">Ngôn ngữ: </span>
                    <span className="text-black font-medium">{book.language}</span>
                  </div>
                )}
                {book.published_date && (
                  <div>
                    <span className="text-black/60">Ngày xuất bản: </span>
                    <span className="text-black font-medium">
                      {new Date(book.published_date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookDetail;
