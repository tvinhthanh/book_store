/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { booksApi } from "../services/books.service";
import { categoriesApi } from "../services/categories.service";
import { authorsApi } from "../services/authors.service";
import { bookCategoriesApi } from "../services/book_categories.service";
import { bookAuthorsApi } from "../services/book_authors.service";
import BookFilter, { FilterState } from "../components/BookFilter";

const BooksPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categoryId: "",
    authorId: "",
    priceRange: "",
  });

  // Fetch data
  const { data: books = [], isLoading } = useQuery("all-books", booksApi.getAll);
  const { data: categories = [] } = useQuery("all-categories", categoriesApi.getAll);
  const { data: authors = [] } = useQuery("all-authors", authorsApi.getAll);

  // Fetch book categories và authors để filter
  const { data: allBookCategories = [] } = useQuery(
    "all-book-categories",
    async () => {
      const results = await Promise.all(
        books.map((book: any) =>
          bookCategoriesApi.getByBook(book.book_id).catch(() => [])
        )
      );
      return results.flat();
    },
    { enabled: books.length > 0 }
  );

  const { data: allBookAuthors = [] } = useQuery(
    "all-book-authors",
    async () => {
      const results = await Promise.all(
        books.map((book: any) =>
          bookAuthorsApi.getByBook(book.book_id).catch(() => [])
        )
      );
      return results.flat();
    },
    { enabled: books.length > 0 }
  );

  // Filter books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by search
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((book: any) =>
        book.title?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (filters.categoryId) {
      const bookIdsInCategory = allBookCategories
        .filter((bc: any) => bc.category_id === filters.categoryId)
        .map((bc: any) => bc.book_id);
      result = result.filter((book: any) =>
        bookIdsInCategory.includes(book.book_id)
      );
    }

    // Filter by author
    if (filters.authorId) {
      const bookIdsByAuthor = allBookAuthors
        .filter((ba: any) => ba.author_id === filters.authorId)
        .map((ba: any) => ba.book_id);
      result = result.filter((book: any) =>
        bookIdsByAuthor.includes(book.book_id)
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((book: any) => {
        const price = Number(book.price) || 0;
        return price >= min && price <= max;
      });
    }

    return result;
  }, [books, filters, allBookCategories, allBookAuthors]);

  const handleViewDetail = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4"></div>
          <p className="text-black">Đang tải sách...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Danh sách sách</h1>

        {/* Filter Component */}
        <BookFilter
          onFilterChange={setFilters}
          categories={categories}
          authors={authors}
        />

        {/* Results count */}
        <div className="mb-4 text-black">
          Tìm thấy <span className="font-bold text-orange-600">{filteredBooks.length}</span>{" "}
          cuốn sách
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white border border-orange-200 rounded-xl p-16 text-center">
            <p className="text-black text-lg">Không tìm thấy sách nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book: any) => (
              <div
                key={book.book_id}
                className="bg-white border border-orange-200 rounded-xl overflow-hidden hover:border-orange-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleViewDetail(book.book_id)}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Không có ảnh
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-black line-clamp-2 min-h-[3rem] mb-2">
                    {book.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-orange-600 font-bold text-lg">
                      {Number(book.price || 0).toLocaleString()}đ
                    </p>
                    {book.stock_quantity !== undefined && (
                      <p className="text-sm text-black">
                        {Number(book.stock_quantity) > 0
                          ? `Còn ${book.stock_quantity} cuốn`
                          : "Hết hàng"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default BooksPage;

