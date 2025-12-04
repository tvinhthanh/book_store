/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { reviewsApi } from "../../services/reviews.service";
import { booksApi } from "../../services/books.service";

const AdminReviewsPage = () => {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery(
    ["admin-reviews"],
    reviewsApi.getAll
  );

  // Fetch all books to get book titles
  const { data: books = [] } = useQuery(["all-books"], booksApi.getAll);

  const deleteMutation = useMutation(reviewsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews"]);
    },
  });

  // Helper function to get book title
  const getBookTitle = (bookId: string) => {
    const book = books.find((b: any) => b.book_id === bookId);
    return book?.title || "N/A";
  };

  // Helper function to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-xs text-black">({rating}/5)</span>
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-black">Đang tải danh sách đánh giá...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-black">Quản lý đánh giá</h2>
      </div>

      {!reviews || reviews.length === 0 ? (
        <p className="text-black text-sm">Chưa có đánh giá nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left text-black">ID</th>
                <th className="border p-2 text-left text-black">Sách</th>
                <th className="border p-2 text-left text-black">Khách hàng ID</th>
                <th className="border p-2 text-left text-black">Đánh giá</th>
                <th className="border p-2 text-left text-black">Bình luận</th>
                <th className="border p-2 text-left text-black">Ngày tạo</th>
                <th className="border p-2 text-center w-[150px] text-black">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review: any) => (
                <tr key={review.review_id}>
                  <td className="border p-2 text-xs font-mono">
                    {review.review_id.substring(0, 8)}...
                  </td>
                  <td className="border p-2">
                    <span className="font-medium">{getBookTitle(review.book_id)}</span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {review.book_id.substring(0, 8)}...
                    </span>
                  </td>
                  <td className="border p-2 text-xs font-mono">
                    {review.customer_id?.substring(0, 8)}...
                  </td>
                  <td className="border p-2">{renderStars(review.rating)}</td>
                  <td className="border p-2 max-w-xs">
                    {review.comment ? (
                      <p className="line-clamp-2 text-xs">{review.comment}</p>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="border p-2 text-xs">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/reviews/${review.review_id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Xem/Sửa
                      </Link>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Bạn chắc chắn muốn xóa đánh giá này?"
                            )
                          ) {
                            deleteMutation.mutate(review.review_id);
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;

