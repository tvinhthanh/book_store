import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { booksApi } from "../../services/books.service";

const AdminBooksPage = () => {
  const queryClient = useQueryClient();

  const { data: books = [], isLoading } = useQuery(
    ["admin-books"],
    booksApi.getAll
  );

  const deleteMutation = useMutation(booksApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-books"]);
    },
  });

  if (isLoading) return <div className="text-black">Đang tải sách...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-black">Quản lý sách</h2>
        <Link
          to="/admin/books/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Thêm sách
        </Link>
      </div>

      {!books || books.length === 0 ? (
        <p className="text-black text-sm">Chưa có sách nào.</p>
      ) : (
        <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left text-black">Ảnh</th>
            <th className="border p-2 text-left text-black">Tên sách</th>
            <th className="border p-2 text-left text-black">Giá</th>
            <th className="border p-2 text-center w-[150px] text-black">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {books.map((b: any) => (
            <tr key={b.book_id}>
              <td className="border p-2">
                {b.cover_image && <img src={b.cover_image} className="w-14" />}
              </td>
              <td className="border p-2 text-black">{b.title}</td>
              <td className="border p-2 text-black">
                {parseFloat(b.price || 0).toLocaleString("vi-VN")} ₫
              </td>
              <td className="border p-2 text-center">
                <div className="flex justify-center gap-2">
                  <Link
                    to={`/admin/books/${b.book_id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm("Bạn chắc chắn muốn xóa sách này?")) {
                        deleteMutation.mutate(b.book_id);
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
      )}
    </div>
  );
};

export default AdminBooksPage;
