import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { booksApi } from "../services/books.service";
import { categoriesApi } from "../services/categories.service";
import { useAppContext } from "../contexts/AppContext";
import PromotionalBanner from "../components/home/PromotionalBanner";
import SaleBanner from "../components/home/SaleBanner";
import MainPromotionalBanners from "../components/home/MainPromotionalBanners";
import SmallPromoBanners from "../components/home/SmallPromoBanners";
import CategoryIcons from "../components/home/CategoryIcons";
import FlashSale from "../components/home/FlashSale";
import HorizontalProductList from "../components/home/HorizontalProductList";
import ProductGrid from "../components/home/ProductGrid";
import SectionHeader from "../components/home/SectionHeader";
import { AiOutlineBook } from "react-icons/ai";

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
  const { data: categories } = useQuery("categories", categoriesApi.getAll);

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

  const handleViewDetail = (id: string) => {
    navigate(`/books/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Đang tải sách...</p>
        </div>
      </div>
    );
  }

  const totalBooks = books?.length || 0;
  const displayBooks = searchData.length > 0 ? searchData : books || [];
  const flashSaleBooks = books?.slice(0, 5) || [];
  const newArrivals = books?.slice(0, 8) || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Top Promotional Banner */}
      <PromotionalBanner />

      {/* Sale Banner với 5 hình ảnh */}
      <SaleBanner />

      {/* Main Promotional Banners */}
      <MainPromotionalBanners />

      {/* Small Promotional Banners */}
      <div className="w-full px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          <SmallPromoBanners />
        </div>
      </div>

      {/* Category Icons */}
      {categories && <CategoryIcons categories={categories} />}

      {/* Flash Sale Section */}
      <FlashSale
        books={flashSaleBooks}
        onAddToCart={handleAddToCart}
        discountPercent={30}
      />

      {/* New Arrivals Section */}
      <HorizontalProductList
        title="Ấn tượng MỚI ĐẾN"
        books={newArrivals}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onViewDetail={handleViewDetail}
        bgColor="bg-gray-50"
      />

      {/* Main Product Grid */}
      <section className="bg-white py-8 w-full">
        <div className="w-full px-4">
          <div className="max-w-7xl mx-auto">
          <SectionHeader
            title={
              searchData.length > 0 ? "Kết quả tìm kiếm" : "Danh sách sách nổi bật"
            }
            subtitle={`${totalBooks} cuốn sách đang chờ bạn khám phá`}
            showViewMore={false}
          />

          {totalBooks === 0 ? (
            <div className="bg-gray-50 rounded-xl p-16 text-center">
              <AiOutlineBook className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có sách nào
              </h3>
              <p className="text-gray-500">
                Hiện tại chưa có sách nào trong hệ thống. Vui lòng quay lại sau!
              </p>
            </div>
          ) : (
            <ProductGrid
              books={displayBooks}
              favorites={favorites}
              discountPercent={20}
              onToggleFavorite={toggleFavorite}
              onAddToCart={handleAddToCart}
              onViewDetail={handleViewDetail}
            />
          )}
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <HorizontalProductList
          title="Danh sách yêu thích của bạn"
          books={favorites}
          onViewDetail={handleViewDetail}
          bgColor="bg-gray-50"
        />
      )}

      {/* Add custom scrollbar hide class */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
};

export default Home;
