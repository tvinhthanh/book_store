import React, { useState, useEffect } from "react";
// import { Heart, ShoppingCart, Book, Search, Flame, Star } from "lucide-react";
import {
  AiOutlineBook,
  AiOutlineFire,
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { useQuery } from "react-query";
import { booksApi } from "../services/books.service";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const cartLS = localStorage.getItem("cart");
    const favLS = localStorage.getItem("favorites");
    if (cartLS) setCart(JSON.parse(cartLS));
    if (favLS) setFavorites(JSON.parse(favLS));
  }, []);

  const saveCart = (data: Book[]) => {
    setCart(data);
    localStorage.setItem("cart", JSON.stringify(data));
  };

  const saveFavorites = (data: Book[]) => {
    setFavorites(data);
    localStorage.setItem("favorites", JSON.stringify(data));
  };

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
          <p className="text-sm text-slate-600 font-medium">Đang tải sách...</p>
        </div>
      </div>
    );
  }

  const totalBooks = books?.length || 0;
  const displayBooks = searchData.length > 0 ? searchData : books || [];

  return (
    <main className="min-h-screen from-amber-50 bg-[#3a3a3a]">
      <div className="max-w-8xl mx-auto px-4 py-6 lg:py-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black rounded-3xl shadow-2xl mb-10 text-[#c8a97e]">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative px-8 py-12 lg:px-12 lg:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <AiOutlineFire className="text-yellow-300 text-lg" />
                  <span className="text-xs font-semibold text-white tracking-wide uppercase">
                    Best Bookstore
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                  Khám phá thế giới sách
                  <br />
                  <span className="text-yellow-300">mỗi ngày</span>
                </h1>

                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  Bộ sưu tập sách được chọn lọc từ tiểu thuyết, kinh doanh đến
                  phát triển bản thân. Khám phá, yêu thích và sở hữu ngay!
                </p>

                <div className="flex flex-wrap gap-3">
                  <button className="bg-white text-indigo-600 hover:bg-yellow-300 hover:text-indigo-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Khám phá ngay
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-white/40">
                    Xem bộ sưu tập
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 lg:gap-5 lg:min-w-[380px]">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <AiOutlineBook className="text-2xl text-white" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Tổng sách
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalBooks}
                  </p>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <AiOutlineShoppingCart className="text-2xl text-white" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Giỏ hàng
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {cart.length}
                  </p>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <AiOutlineHeart className="text-2xl text-white" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Yêu thích
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {favorites.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {searchData.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <AiOutlineSearch className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Kết quả tìm kiếm
                  </h2>
                  <p className="text-sm text-slate-500">
                    Tìm thấy {searchData.length} tựa sách phù hợp
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          </section>
        )}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <AiOutlineStar className="text-xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#c8a97e]">
                  {searchData.length > 0
                    ? "Tất cả sách"
                    : "Danh sách sách nổi bật"}
                </h2>
                <p className="text-sm text-[#b2a66e]">
                  {totalBooks} cuốn sách đang chờ bạn khám phá
                </p>
              </div>
            </div>
          </div>

          {totalBooks === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                <AiOutlineBook className="text-4xl text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Chưa có sách nào
              </h3>
              <p className="text-slate-500">
                Hiện tại chưa có sách nào trong hệ thống. Vui lòng quay lại sau!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayBooks.map((book: Book) => (
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
          )}
        </section>

        {favorites.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <AiOutlineHeart className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Danh sách yêu thích
                  </h2>
                  <p className="text-sm text-slate-500">
                    {favorites.length} cuốn sách bạn đã lưu
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((book) => (
                <div
                  key={book.book_id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-emerald-600">
                        {book.price.toLocaleString()}đ
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <AiOutlineStar className="text-sm" />
                        <AiOutlineStar className="text-sm" />
                        <AiOutlineStar className="text-sm" />
                        <AiOutlineStar className="text-sm" />
                        <AiOutlineStar className="text-sm text-slate-300" />
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetail(book.book_id)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Home;
