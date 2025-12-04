/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { authorsApi } from "../../services/authors.service";

const AdminAuthorsPage = () => {
  const queryClient = useQueryClient();

  const { data: authors = [], isLoading } = useQuery(
    ["admin-authors"],
    authorsApi.getAll
  );

  const deleteMutation = useMutation(authorsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-authors"]);
    },
  });

  if (isLoading) {
    return <div>Đang tải danh sách tác giả...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Quản lý tác giả</h2>
        <Link
          to="/admin/authors/create"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Thêm tác giả
        </Link>
      </div>

      {!authors || authors.length === 0 ? (
        <p className="text-black text-sm">Chưa có tác giả nào.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left text-black">Tên tác giả</th>
              <th className="border p-2 text-left text-black">Tiểu sử</th>
              <th className="border p-2 text-left text-black">Ngày sinh</th>
              <th className="border p-2 text-left text-black">Quốc gia</th>
              <th className="border p-2 text-center w-[160px] text-black">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author: any) => (
              <tr key={author.author_id}>
                <td className="border p-2 font-medium text-black">{author.name}</td>
                <td className="border p-2 text-black">
                  {author.bio ? (
                    <span className="line-clamp-2">{author.bio}</span>
                  ) : (
                    <span className="text-black">-</span>
                  )}
                </td>
                <td className="border p-2 text-black">
                  {author.birth_date
                    ? new Date(author.birth_date).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="border p-2 text-black">{author.country || "-"}</td>
                <td className="border p-2">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/admin/authors/${author.author_id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Bạn chắc chắn muốn xóa tác giả này?"
                          )
                        ) {
                          deleteMutation.mutate(author.author_id);
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

export default AdminAuthorsPage;

