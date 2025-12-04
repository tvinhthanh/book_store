/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface BookFilterProps {
  onFilterChange: (filters: FilterState) => void;
  categories: any[];
  authors: any[];
}

export interface FilterState {
  search: string;
  categoryId: string;
  authorId: string;
  priceRange: string;
}

const BookFilter = ({ onFilterChange, categories, authors }: BookFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categoryId: "",
    authorId: "",
    priceRange: "",
  });

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      categoryId: "",
      authorId: "",
      priceRange: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white border border-orange-200 rounded-xl p-6 shadow-lg mb-8">
      <h2 className="text-xl font-bold text-black mb-4">Tìm kiếm & Lọc sách</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tìm kiếm theo tên */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600" size={18} />
            <input
              type="text"
              placeholder="Nhập tên sách..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg bg-transparent text-black placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Chọn thể loại */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Thể loại
          </label>
          <select
            value={filters.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
            className="w-full px-4 py-2 border border-orange-200 rounded-lg bg-transparent text-black focus:outline-none focus:border-orange-500"
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn tác giả */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Tác giả
          </label>
          <select
            value={filters.authorId}
            onChange={(e) => handleChange("authorId", e.target.value)}
            className="w-full px-4 py-2 border border-orange-200 rounded-lg bg-transparent text-black focus:outline-none focus:border-orange-500"
          >
            <option value="">Tất cả tác giả</option>
            {authors.map((author) => (
              <option key={author.author_id} value={author.author_id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mức giá */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Mức giá
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleChange("priceRange", e.target.value)}
            className="w-full px-4 py-2 border border-orange-200 rounded-lg bg-transparent text-black focus:outline-none focus:border-orange-500"
          >
            <option value="">Tất cả mức giá</option>
            <option value="0-50000">Dưới 50.000đ</option>
            <option value="50000-100000">50.000đ - 100.000đ</option>
            <option value="100000-200000">100.000đ - 200.000đ</option>
            <option value="200000-500000">200.000đ - 500.000đ</option>
            <option value="500000-999999999">Trên 500.000đ</option>
          </select>
        </div>
      </div>

      {/* Nút reset */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-lg transition"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
};

export default BookFilter;

