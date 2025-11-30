import React, { useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../services/api-client";
import { useNavigate } from "react-router-dom";

const QuanLyDonHang: React.FC = () => {
  const { storeId } = useAppContext();
  const navigate = useNavigate();

  const { data: orders, isLoading, isError, refetch } = useQuery(
    ["getOrdersByStoreId", storeId],
    () => apiClient.getOrdersByStoreId(storeId as string),
    {
      enabled: !!storeId,
      onError: (error) => {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      },
    }
  );

  const { mutate: deleteOrder } = useMutation(apiClient.deleteOrder, {
    onError: (error) => {
      console.error("Lỗi khi xóa đơn hàng:", error);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (orderId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      deleteOrder(orderId);
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  const handleUpdateOrder = (orderId: string) => {
    navigate(`/order/update/${orderId}`);
  };

  // Hàm để chuyển đổi định dạng ngày từ ISO sang dd-MM-yy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-4);
    return `${day}-${month}-${year}`;
  };

  if (isLoading) {
    return <span>Đang tải danh sách đơn hàng...</span>;
  }

  if (isError) {
    return <div>Không thể lấy danh sách đơn hàng</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý Đơn Hàng</h1>
      <div className="space-y-6">
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <div
              key={order.id}
              className="border border-gray-300 rounded-lg p-4 shadow-md bg-white"
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">Đơn Hàng #{order.order_id}</h3>
                <span className="text-gray-500">{formatDate(order.orderDate)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-700">Tổng Tiền: {order.totalAmount} VND</span>
                <span
                  className={`
                    ${order.orderStatus === "pending" ? "text-yellow-500" :
                      order.orderStatus === "confirm" ? "text-green-500" :
                        order.orderStatus === "cancel" ? "text-red-500" : "text-gray-500"}
                  `}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={() => handleViewOrder(order.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Xem Chi Tiết
                </button>

                <button
                  onClick={() => handleUpdateOrder(order.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Cập Nhật
                </button>

                <button
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default QuanLyDonHang;
