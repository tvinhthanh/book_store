/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { reviewsApi } from "../../services/reviews.service";
import { booksApi } from "../../services/books.service";

type ReviewFormValues = {
  rating: number;
  comment?: string;
};

const AdminReviewForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<ReviewFormValues>();

  // Load existing review data
  const { data: review, isLoading } = useQuery(
    ["admin-review", id],
    () => reviewsApi.getById(id as string),
    {
      enabled: isEdit,
    }
  );

  // Load book info
  const { data: book } = useQuery(
    ["book", review?.book_id],
    () => booksApi.getByID(review?.book_id),
    {
      enabled: isEdit && !!review?.book_id,
    }
  );

  useEffect(() => {
    if (review && isEdit) {
      reset({
        rating: review.rating || 1,
        comment: review.comment || "",
      });
    }
  }, [review, isEdit, reset]);

  const mutation = useMutation(
    (formData: ReviewFormValues) => {
      if (isEdit) {
        return reviewsApi.update(id as string, formData);
      }
      // Reviews are usually created by customers, but we can allow admin to create if needed
      return reviewsApi.create(formData);
    },
    {
      onSuccess: () => {
        navigate("/admin/reviews");
      },
      onError: (error: any) => {
        alert(error?.message || "Có lỗi xảy ra khi lưu đánh giá.");
      },
    }
  );

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values);
  });

  if (isEdit && isLoading) {
    return <div>Đang tải thông tin đánh giá...</div>;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto"
    >
      <h2 className="font-bold text-lg mb-4">
        {isEdit ? "Xem/Sửa đánh giá" : "Tạo đánh giá mới"}
      </h2>

      {isEdit && review && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
          <div>
            <span className="font-medium">Review ID:</span>{" "}
            <span className="font-mono text-xs">{review.review_id}</span>
          </div>
          {book && (
            <div>
              <span className="font-medium">Sách:</span> {book.title}
            </div>
          )}
          <div>
            <span className="font-medium">Khách hàng ID:</span>{" "}
            <span className="font-mono text-xs">{review.customer_id}</span>
          </div>
          {review.created_at && (
            <div>
              <span className="font-medium">Ngày tạo:</span>{" "}
              {new Date(review.created_at).toLocaleString("vi-VN")}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* RATING */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Đánh giá <span className="text-red-500">*</span> (1-5 sao)
          </label>
          <select
            className="border rounded w-full px-3 py-2 text-sm"
            {...register("rating", {
              required: true,
              valueAsNumber: true,
              min: 1,
              max: 5,
            })}
          >
            <option value={1}>1 sao - Rất tệ</option>
            <option value={2}>2 sao - Tệ</option>
            <option value={3}>3 sao - Bình thường</option>
            <option value={4}>4 sao - Tốt</option>
            <option value={5}>5 sao - Rất tốt</option>
          </select>
          {isEdit && review && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-black">Hiện tại:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= review.rating
                        ? "text-yellow-400 text-lg"
                        : "text-gray-300 text-lg"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COMMENT */}
        <div>
          <label className="block text-sm font-medium mb-1">Bình luận</label>
          <textarea
            className="border rounded w-full px-3 py-2 text-sm"
            rows={5}
            {...register("comment")}
            placeholder="Nhập bình luận của khách hàng..."
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/reviews")}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm"
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminReviewForm;

