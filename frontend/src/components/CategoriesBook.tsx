import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useMemo, useState } from "react";
import {
  AiOutlineSearch,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { bookCategoriesApi } from "../services/book_categories.service";

const CategoryBooks = () => {
  const { id } = useParams<{ id: string }>();

  const { data: books, isLoading } = useQuery(
    ["books-by-category", id],
    () => bookCategoriesApi.getBooksByCategory(id as string),
    { enabled: !!id }
  );

  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">(
    "default"
  );
  const [onlyInStock, setOnlyInStock] = useState(false);

  const filteredBooks = useMemo(() => {
    if (!books) return [];

    let result = [...books];

    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      result = result.filter((b: any) =>
        String(b.title || "")
          .toLowerCase()
          .includes(kw)
      );
    }

    if (onlyInStock) {
      result = result.filter(
        (b: any) =>
          b.stock_quantity === null ||
          typeof b.stock_quantity === "undefined" ||
          Number(b.stock_quantity) > 0
      );
    }

    if (sort === "price-asc") {
      result.sort(
        (a: any, b: any) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (sort === "price-desc") {
      result.sort(
        (a: any, b: any) => Number(b.price || 0) - Number(a.price || 0)
      );
    }

    return result;
  }, [books, keyword, sort, onlyInStock]);

  if (isLoading) {
    return (
      <main className="bg-transparent min-h-screen text-black flex items-center justify-center">
        <div className="text-sm text-black">Đang tải sách...</div>
      </main>
    );
  }

  return (
    <main className="bg-transparent min-h-screen text-black">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* TIÊU ĐỀ + TÓM TẮT */}
        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] text-orange-600/70 uppercase">
            BOOKSTORE
          </p>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold text-orange-600 uppercase tracking-wide">
              Sách theo thể loại
            </h1>
            <p className="text-sm text-black md:text-right">
              Tìm kiếm, sắp xếp và lọc nhanh những cuốn sách phù hợp trong thể
              loại bạn quan tâm.
            </p>
          </div>
        </div>

        {/* THANH FILTER / SEARCH */}
        <div className="mb-8 bg-transparent border border-orange-200 rounded-2xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between shadow-lg">
          {/* Search */}
          <div className="flex items-center bg-transparent rounded-full px-3 py-1.5 w-full md:w-80 border border-orange-200">
            <AiOutlineSearch className="text-orange-600 mr-2" size={18} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm trong thể loại..."
              className="bg-transparent text-xs md:text-sm text-black placeholder:text-orange-500/50 outline-none w-full"
            />
          </div>

          {/* Sort + in-stock */}
          <div className="flex flex-wrap gap-2 items-center justify-start md:justify-end">
            <div className="flex items-center bg-gray-100 rounded-full px-1 py-1 text-xs md:text-sm">
              <button
                type="button"
                onClick={() => setSort("price-asc")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${
                  sort === "price-asc"
                    ? "bg-orange-500 text-white"
                    : "text-black hover:bg-gray-200"
                }`}
              >
                <AiOutlineSortAscending size={14} />
                Giá ↑
              </button>
              <button
                type="button"
                onClick={() => setSort("price-desc")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${
                  sort === "price-desc"
                    ? "bg-orange-500 text-white"
                    : "text-black hover:bg-gray-200"
                }`}
              >
                <AiOutlineSortDescending size={14} />
                Giá ↓
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOnlyInStock((v) => !v)}
              className={`text-xs md:text-sm px-4 py-1.5 rounded-full border transition ${
                onlyInStock
                  ? "border-orange-600 bg-orange-50 text-orange-600"
                  : "border-orange-200 text-black hover:border-orange-400"
              }`}
            >
              Chỉ hiện sách còn hàng
            </button>
          </div>
        </div>

        {/* GRID SÁCH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((b: any) => (
            <div
              key={b.book_id}
              className="bg-white border border-orange-200 rounded-2xl p-3 flex flex-col hover:border-orange-500 hover:shadow-xl hover:shadow-orange-200 transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-xl mb-3">
                <img
                  src={b.cover_image}
                  alt={b.title}
                  className="w-full h-52 object-cover transform hover:scale-[1.03] transition-transform duration-300"
                />
              </div>

              <h3 className="text-sm font-semibold text-black line-clamp-2 min-h-[2.5rem]">
                {b.title}
              </h3>

              <p className="text-orange-600 font-semibold mt-2">
                {Number(b.price).toLocaleString()}đ
              </p>

              {typeof b.stock_quantity !== "undefined" && (
                <p className="mt-1 text-xs text-black">
                  {Number(b.stock_quantity) > 0
                    ? `${b.stock_quantity} cuốn còn lại`
                    : "Hết hàng"}
                </p>
              )}
            </div>
          ))}

          {filteredBooks.length === 0 && (
            <p className="col-span-full text-sm text-black">
              Không có sách phù hợp với bộ lọc hiện tại.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default CategoryBooks;
