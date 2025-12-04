/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { publishersApi } from "../../services/publishers.service";

const AdminPublishersPage = () => {
  const queryClient = useQueryClient();

  const { data: publishers = [], isLoading } = useQuery(
    ["admin-publishers"],
    publishersApi.getAll
  );

  const deleteMutation = useMutation(publishersApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-publishers"]);
    },
  });

  if (isLoading) {
    return <div>Đang tải danh sách nhà xuất bản...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Quản lý nhà xuất bản</h2>
        <Link
          to="/admin/publishers/create"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Thêm nhà xuất bản
        </Link>
      </div>

      {!publishers || publishers.length === 0 ? (
        <p className="text-black text-sm">Chưa có nhà xuất bản nào.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left text-black">Tên nhà xuất bản</th>
              <th className="border p-2 text-left text-black">Địa chỉ</th>
              <th className="border p-2 text-left text-black">Email</th>
              <th className="border p-2 text-left text-black">Số điện thoại</th>
              <th className="border p-2 text-center w-[160px] text-black">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((publisher: any) => (
              <tr key={publisher.publisher_id}>
                <td className="border p-2 font-medium text-black">{publisher.name}</td>
                <td className="border p-2 text-black">{publisher.address || "-"}</td>
                <td className="border p-2 text-black">{publisher.email || "-"}</td>
                <td className="border p-2 text-black">{publisher.phone || "-"}</td>
                <td className="border p-2">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/admin/publishers/${publisher.publisher_id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Bạn chắc chắn muốn xóa nhà xuất bản này?"
                          )
                        ) {
                          deleteMutation.mutate(publisher.publisher_id);
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

export default AdminPublishersPage;

