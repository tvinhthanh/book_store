/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { categoriesApi } from "../../services/categories.service";

const AdminCategoriesPage = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery(
    ["admin-categories"],
    categoriesApi.getAll
  );

  const deleteMutation = useMutation(categoriesApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-categories"]);
    },
  });

  if (isLoading) {
    return <div className="text-black">Đang tải danh mục...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-black">Quản lý danh mục</h2>
        <Link
          to="/admin/categories/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Thêm danh mục
        </Link>
      </div>

      {!categories || categories.length === 0 ? (
        <p className="text-black text-sm">Chưa có danh mục nào.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left text-black">Tên danh mục</th>
              <th className="border p-2 text-left text-black">Mô tả</th>
              <th className="border p-2 text-center w-[150px] text-black">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c: any) => (
              <tr key={c.category_id}>
                <td className="border p-2 text-black">{c.name}</td>
                <td className="border p-2 text-black">{c.description}</td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/admin/categories/${c.category_id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm("Bạn chắc chắn muốn xóa?")) {
                          deleteMutation.mutate(c.category_id);
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

export default AdminCategoriesPage;
