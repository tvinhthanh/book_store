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

  if (isLoading) return <div>Đang tải sách...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold text-lg">Quản lý sách</h2>
        <Link
          to="/admin/books/create"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Thêm sách
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Ảnh</th>
            <th className="border p-2">Tên sách</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {books.map((b: any) => (
            <tr key={b.book_id}>
              <td className="border p-2">
                {b.cover_image && <img src={b.cover_image} className="w-14" />}
              </td>
              <td className="border p-2">{b.title}</td>
              <td className="border p-2">{b.price}</td>
              <td className="border p-2 flex gap-2">
                <Link
                  to={`/admin/books/${b.book_id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Sửa
                </Link>

                <button
                  onClick={() => deleteMutation.mutate(b.book_id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBooksPage;
