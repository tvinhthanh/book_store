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
      <div className="min-h-[50vh] flex items-center justify-center bg-[#f9f3ea]">
        <p className="text-sm text-slate-500">Đang tải chi tiết sách...</p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 bg-[#f9f3ea]">
        <p className="text-sm text-red-500">Không tìm thấy sách.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[#c8a97e] hover:underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <main className="bg-[#f9f3ea]">
      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-10">
        {/* nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#c8a97e] transition-colors"
        >
          <AiOutlineArrowLeft />
          <span>Quay lại</span>
        </button>

        {/* card chi tiết */}
        <div className="rounded-3xl bg-gradient-to-br from-black via-[#171616] to-black text-[#f4ede4] shadow-2xl overflow-hidden border border-[#3b2a1a]/70">
          <div className="flex flex-col lg:flex-row">
            {/* ảnh sách */}
            <div className="lg:w-2/5 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#111] flex items-center justify-center p-6">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full max-w-xs rounded-2xl object-cover shadow-lg shadow-black/70"
                />
              ) : (
                <div className="w-full max-w-xs aspect-[3/4] rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm text-zinc-400">
                  Không có ảnh bìa
                </div>
              )}
            </div>

            {/* thông tin sách */}
            <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col gap-5">
              <div>
                <p className="text-xs tracking-[0.22em] uppercase text-[#c8a97e]/70 mb-2">
                  Book detail
                </p>
                <h1 className="text-2xl lg:text-3xl font-bold leading-snug">
                  {book.title}
                </h1>
                {book.isbn && (
                  <p className="text-xs text-zinc-400 mt-1">
                    ISBN: {book.isbn}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Giá bán</p>
                  <p className="text-2xl font-semibold text-[#c8a97e]">
                    {book.price.toLocaleString()}đ
                  </p>
                </div>
                {typeof book.stock_quantity === "number" && (
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Tồn kho</p>
                    <p className="text-sm">
                      {book.stock_quantity > 0
                        ? `${book.stock_quantity} cuốn`
                        : "Hết hàng"}
                    </p>
                  </div>
                )}
              </div>

              {book.description && (
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Giới thiệu</p>
                  <p className="text-sm text-zinc-200 leading-relaxed max-h-40 overflow-y-auto pr-1">
                    {book.description}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-md transition-colors ${
                    inCart
                      ? "bg-zinc-700 text-zinc-300 cursor-default"
                      : "bg-[#c8a97e] text-[#2f2f2f] hover:bg-[#b48c66]"
                  }`}
                >
                  <AiOutlineShoppingCart />
                  <span>{inCart ? "Đã trong giỏ" : "Thêm vào giỏ"}</span>
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[#c8a97e]/70 text-[#c8a97e] hover:bg-[#c8a97e]/10 transition-colors"
                >
                  {favorited ? (
                    <AiFillHeart className="text-[#ff6b81]" />
                  ) : (
                    <AiOutlineHeart />
                  )}
                  <span>
                    {favorited ? "Đã yêu thích" : "Thêm vào yêu thích"}
                  </span>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-400">
                {book.language && (
                  <span>
                    Ngôn ngữ:{" "}
                    <span className="text-zinc-200">{book.language}</span>
                  </span>
                )}
                {book.published_date && (
                  <span>
                    Ngày xuất bản:{" "}
                    <span className="text-zinc-200">
                      {new Date(book.published_date).toLocaleDateString()}
                    </span>
                  </span>
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
