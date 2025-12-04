/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { ordersApi } from "../../services/orders.service";

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery(
    ["admin-orders"],
    ordersApi.getAll
  );

  const deleteMutation = useMutation(ordersApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orders"]);
    },
  });

  if (isLoading) {
    return <div className="text-black">Đang tải đơn hàng...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-black">Quản lý đơn hàng</h2>
      </div>

      {!orders || orders.length === 0 ? (
        <p className="text-black text-sm">Chưa có đơn hàng nào.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left text-black">Mã đơn</th>
              <th className="border p-2 text-left text-black">Khách hàng</th>
              <th className="border p-2 text-right text-black">Tổng tiền</th>
              <th className="border p-2 text-left text-black">Thanh toán</th>
              <th className="border p-2 text-left text-black">Trạng thái</th>
              <th className="border p-2 text-center w-[150px] text-black">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.order_id}>
                <td className="border p-2 text-black">{o.order_id}</td>
                <td className="border p-2 text-black">{o.customer_id}</td>
                <td className="border p-2 text-right text-black">
                  {Number(o.total_amount).toLocaleString("vi-VN")} ₫
                </td>
                <td className="border p-2 text-black">{o.payment_method}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs
                    ${
                      o.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : o.status === "paid" || o.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : o.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.status === "pending" && "Chờ xử lý"}
                    {o.status === "paid" && "Đã thanh toán"}
                    {o.status === "shipped" && "Đã giao hàng"}
                    {o.status === "delivered" && "Đã nhận hàng"}
                    {o.status === "cancelled" && "Đã hủy"}
                    {!["pending", "paid", "shipped", "delivered", "cancelled"].includes(o.status) && o.status}
                  </span>
                </td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/admin/orders/${o.order_id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Xem / sửa
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm("Bạn chắc chắn muốn xóa đơn hàng này?")
                        ) {
                          deleteMutation.mutate(o.order_id);
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

export default AdminOrdersPage;
