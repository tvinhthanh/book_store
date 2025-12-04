/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { usersApi } from "../../services/users.service";

const AdminUsersPage = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery(
    ["admin-users"],
    usersApi.getAll
  );

  const deleteMutation = useMutation(usersApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
    },
  });

  if (isLoading) {
    return <div>Đang tải danh sách người dùng...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Quản lý người dùng</h2>

        <Link
          to="/admin/users/create"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Thêm người dùng
        </Link>
      </div>

      {!users || users.length === 0 ? (
        <p className="text-black text-sm">Chưa có người dùng nào.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left text-black">Tên</th>
              <th className="border p-2 text-left text-black">Email</th>
              <th className="border p-2 text-left text-black">Số điện thoại</th>
              <th className="border p-2 text-left text-black">Role</th>
              <th className="border p-2 text-center w-[160px] text-black">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id_user}>
                <td className="border p-2 text-black">{u.name}</td>
                <td className="border p-2 text-black">{u.email}</td>
                <td className="border p-2 text-black">{u.phone}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs
                    ${
                      u.role === "admin"
                        ? "bg-purple-100 text-black"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="border p-2">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/admin/users/${u.id_user}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Bạn chắc chắn muốn xóa người dùng này?"
                          )
                        ) {
                          deleteMutation.mutate(u.id_user);
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

export default AdminUsersPage;
