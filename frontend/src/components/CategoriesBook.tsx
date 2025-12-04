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
      <main className="bg-[#353535] min-h-screen text-[#f4ede4] flex items-center justify-center">
        <div className="text-sm text-slate-300">Đang tải sách...</div>
      </main>
    );
  }

  return (
    <main className="bg-[#353535] min-h-screen text-[#f4ede4]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* TIÊU ĐỀ + TÓM TẮT */}
        <div className="mb-6">
          <p className="text-xs tracking-[0.2em] text-[#c8a97e]/70 uppercase">
            BOOKSTORE
          </p>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#c8a97e] uppercase tracking-wide">
              Sách theo thể loại
            </h1>
            <p className="text-sm text-slate-300 md:text-right">
              Tìm kiếm, sắp xếp và lọc nhanh những cuốn sách phù hợp trong thể
              loại bạn quan tâm.
            </p>
          </div>
        </div>

        {/* THANH FILTER / SEARCH */}
        <div className="mb-8 bg-black/40 border border-[#4a3a29]/70 rounded-2xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between shadow-lg shadow-black/30">
          {/* Search */}
          <div className="flex items-center bg-black/60 rounded-full px-3 py-1.5 w-full md:w-80">
            <AiOutlineSearch className="text-[#c8a97e] mr-2" size={18} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm trong thể loại..."
              className="bg-transparent text-xs md:text-sm text-[#f4ede4] placeholder:text-[#c8a97e]/50 outline-none w-full"
            />
          </div>

          {/* Sort + in-stock */}
          <div className="flex flex-wrap gap-2 items-center justify-start md:justify-end">
            <div className="flex items-center bg-black/60 rounded-full px-1 py-1 text-xs md:text-sm">
              <button
                type="button"
                onClick={() => setSort("price-asc")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${
                  sort === "price-asc"
                    ? "bg-[#c8a97e] text-[#2f2f2f]"
                    : "text-[#f4ede4]/75 hover:bg-white/5"
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
                    ? "bg-[#c8a97e] text-[#2f2f2f]"
                    : "text-[#f4ede4]/75 hover:bg-white/5"
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
                  ? "border-[#c8a97e] bg-[#c8a97e]/10 text-[#c8a97e]"
                  : "border-[#4a3a29] text-[#f4ede4]/80 hover:border-[#c8a97e]/60"
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
              className="bg-black/90 border border-[#3b2a1a] rounded-2xl p-3 flex flex-col hover:border-[#c8a97e]/70 hover:shadow-xl hover:shadow-[#c8a97e]/25 transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-xl mb-3">
                <img
                  src={b.cover_image}
                  alt={b.title}
                  className="w-full h-52 object-cover transform hover:scale-[1.03] transition-transform duration-300"
                />
              </div>

              <h3 className="text-sm font-semibold text-[#f4ede4] line-clamp-2 min-h-[2.5rem]">
                {b.title}
              </h3>

              <p className="text-[#c8a97e] font-semibold mt-2">
                {Number(b.price).toLocaleString()}đ
              </p>

              {typeof b.stock_quantity !== "undefined" && (
                <p className="mt-1 text-xs text-slate-300">
                  {Number(b.stock_quantity) > 0
                    ? `${b.stock_quantity} cuốn còn lại`
                    : "Hết hàng"}
                </p>
              )}
            </div>
          ))}

          {filteredBooks.length === 0 && (
            <p className="col-span-full text-sm text-slate-300">
              Không có sách phù hợp với bộ lọc hiện tại.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default CategoryBooks;
