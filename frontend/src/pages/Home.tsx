import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { booksApi } from "../services/books.service";
import { useAppContext } from "../contexts/AppContext";
import BookCard from "../components/BookCard";

interface Book {
  book_id: string;
  title: string;
  price: number;
  description: string;
  cover_image: string;
}

const Home: React.FC = () => {
  const { searchData } = useAppContext();
  const navigate = useNavigate();

  const [cart, setCart] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Book[]>([]);

  // Load LS
  useEffect(() => {
    const cartLS = localStorage.getItem("cart");
    const favLS = localStorage.getItem("favorites");
    if (cartLS) setCart(JSON.parse(cartLS));
    if (favLS) setFavorites(JSON.parse(favLS));
  }, []);

  // Save LS
  const saveCart = (data: Book[]) => {
    setCart(data);
    localStorage.setItem("cart", JSON.stringify(data));
  };

  const saveFavorites = (data: Book[]) => {
    setFavorites(data);
    localStorage.setItem("favorites", JSON.stringify(data));
  };

  // API load all books
  const { data: books, isLoading } = useQuery("books", booksApi.getAll);

  const handleAddToCart = (book: Book) => {
    const exists = cart.some((i) => i.book_id === book.book_id);
    if (!exists) {
      saveCart([...cart, book]);
      alert("Đã thêm vào giỏ hàng!");
    } else {
      alert("Sách đã có trong giỏ hàng.");
    }
  };

  const toggleFavorite = (book: Book) => {
    const exists = favorites.some((i) => i.book_id === book.book_id);
    exists
      ? saveFavorites(favorites.filter((i) => i.book_id !== book.book_id))
      : saveFavorites([...favorites, book]);
  };

  const handleViewDetail = (id: string) => navigate(`/books/${id}`);

  if (isLoading) {
    return (
      <p className="text-center py-10 text-purple-300">Đang tải sách...</p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* SEARCH RESULTS */}
      {searchData.length > 0 && (
        <>
          <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
            Kết quả tìm kiếm
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {searchData.map((book: Book) => (
              <BookCard
                key={book.book_id}
                book={book}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                handleAddToCart={handleAddToCart}
                handleViewDetail={handleViewDetail}
              />
            ))}
          </div>
        </>
      )}

      {/* ALL BOOKS */}
      <h1 className="text-3xl font-bold mb-6 text-black drop-shadow-lg">
        Danh sách tất cả sách
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {books?.map((book: Book) => (
          <BookCard
            key={book.book_id}
            book={book}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            handleAddToCart={handleAddToCart}
            handleViewDetail={handleViewDetail}
          />
        ))}
      </div>

      {/* FAVORITES */}
      {favorites.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">
            Danh sách yêu thích
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((book) => (
              <div
                key={book.book_id}
                className="bg-white/10 p-4 rounded-lg backdrop-blur-lg shadow-lg"
              >
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-44 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-bold text-white">{book.title}</h3>
                <p className="text-purple-300 mt-1">
                  {book.price.toLocaleString()}đ
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
