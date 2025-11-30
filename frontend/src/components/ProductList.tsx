/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { booksApi } from "../services/books.service";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface Product {
  book_id: string;
  title: string;
  price: number;
  description: string;
  cover_image: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [error, setError] = useState("");

  // Load favorites + cart
  useEffect(() => {
    const fav = localStorage.getItem("favorites");
    const cartData = localStorage.getItem("cart");

    if (fav) setFavorites(JSON.parse(fav));
    if (cartData) setCart(JSON.parse(cartData));
  }, []);

  // Load products
  useEffect(() => {
    const load = async () => {
      try {
        const data = await booksApi.getAll();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    load();
  }, []);

  const updateFavorites = (newList: Product[]) => {
    setFavorites(newList);
    localStorage.setItem("favorites", JSON.stringify(newList));
  };

  const updateCart = (newList: Product[]) => {
    setCart(newList);
    localStorage.setItem("cart", JSON.stringify(newList));
  };

  const toggleFavorite = (p: Product) => {
    const exists = favorites.some((f) => f.book_id === p.book_id);
    const newFavs = exists
      ? favorites.filter((f) => f.book_id !== p.book_id)
      : [...favorites, p];

    updateFavorites(newFavs);
  };

  const toggleCart = (p: Product) => {
    const exists = cart.some((i) => i.book_id === p.book_id);
    const newCart = exists
      ? cart.filter((i) => i.book_id !== p.book_id)
      : [...cart, p];

    updateCart(newCart);
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Danh sách sách</h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => {
          const isFav = favorites.some((f) => f.book_id === p.book_id);
          const inCart = cart.some((i) => i.book_id === p.book_id);

          return (
            <div
              key={p.book_id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* IMAGE WRAPPER + HEART ICON (TOP LEFT) */}
              <div className="relative overflow-hidden rounded-t-xl">
                <button
                  onClick={() => toggleFavorite(p)}
                  className="absolute top-2 left-2 z-20
                             bg-white/90 backdrop-blur-sm p-2 rounded-full shadow
                             hover:scale-110 active:scale-95 transition"
                >
                  {isFav ? (
                    <AiFillHeart className="text-red-500 text-2xl" />
                  ) : (
                    <AiOutlineHeart className="text-gray-600 text-2xl" />
                  )}
                </button>

                <img
                  src={p.cover_image}
                  alt={p.title}
                  className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {p.title}
                </h2>

                <p className="text-green-600 font-bold text-lg mb-2">
                  {p.price.toLocaleString()}đ
                </p>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {p.description}
                </p>

                <button
                  onClick={() => toggleCart(p)}
                  className={`w-full py-2 rounded-md text-white font-medium transition
                    ${inCart
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  disabled={inCart}
                >
                  {inCart ? "Đã trong giỏ hàng" : "Thêm vào giỏ hàng"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAVORITES */}
      <h2 className="text-3xl font-bold mt-12 mb-5 text-gray-900">
        Danh sách yêu thích
      </h2>

      {favorites.length === 0 && (
        <p className="text-gray-500 italic">Bạn chưa thích sách nào.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((p) => (
          <div key={p.book_id} className="bg-white rounded-xl shadow-md p-4">
            <img
              src={p.cover_image}
              className="w-full h-44 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-green-600 font-bold">
              {p.price.toLocaleString()}đ
            </p>
          </div>
        ))}
      </div>

      {/* CART */}
      <h2 className="text-3xl font-bold mt-12 mb-5 text-gray-900">
        Giỏ hàng
      </h2>

      {cart.length === 0 && (
        <p className="text-gray-500 italic">Giỏ hàng của bạn đang trống.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cart.map((p) => (
          <div key={p.book_id} className="bg-white rounded-xl shadow-md p-4">
            <img
              src={p.cover_image}
              className="w-full h-44 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-green-600 font-bold">
              {p.price.toLocaleString()}đ
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
