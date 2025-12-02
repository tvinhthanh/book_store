import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import * as apiClient from "../services/api-client"; // Đảm bảo apiClient có method searchProducts

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query"); // Lấy giá trị query từ URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(
    () => {
      // Gửi request tìm kiếm (giả sử bạn có hàm searchProduct trong apiClient)
      //     const fetchSearchResults = async () => {
      //       setLoading(true);  // Bắt đầu quá trình tìm kiếm
      //       setError(null);    // Xóa lỗi trước đó
      //       try {
      //         if (query) {
      //           const response = await apiClient.searchProducts(query);  // Gọi API tìm kiếm
      //           setResults(response);
      //         } else {
      //           setResults([]);  // Trường hợp không có query
      //         }
      //       } catch (error) {
      //         console.error("Error fetching search results:", error);
      //         setError("Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.");
      //       } finally {
      //         setLoading(false);  // Hoàn tất quá trình tìm kiếm
      //       }
      //     };
      //     if (query) {
      //       fetchSearchResults();
    }
    //   }, [query]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        Kết quả tìm kiếm cho "{query}"
      </h1>
      {loading && <p>Đang tìm kiếm...</p>} {/* Thông báo khi đang tìm kiếm */}
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Thông báo lỗi nếu có lỗi */}
      {results.length === 0 && !loading && !error && (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}
      <ul></ul>
    </div>
  );
};

export default SearchPage;
