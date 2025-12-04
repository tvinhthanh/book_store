import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../../contexts/AppContext";
import { ordersApi } from "../../services/orders.service";
import { booksApi } from "../../services/books.service";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  order_item_id: string;
  book_id: string;
  quantity: number;
  price: number;
  book?: {
    book_id: string;
    title: string;
    cover_image: string;
  };
}

interface Order {
  order_id: string;
  customer_id: string;
  status: string;
  total_amount: number;
  payment_method: string;
  order_date: string;
  items: OrderItem[];
}

const MyDonHang: React.FC = () => {
  const { userId } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading: isLoadingOrders, isError: isErrorOrders } = useQuery(
    ["getOrdersByUserId", userId],
    () => ordersApi.getByUserId(userId as string),
    {
      enabled: !!userId,
      onError: (error) => {
        console.error("Error fetching orders:", error);
      },
    }
  );

  // Fetch book details for order items
  const { data: allBooks } = useQuery(
    ["allBooks"],
    () => booksApi.getAll(),
    {
      enabled: !!ordersData,
    }
  );

  // Mutation để hủy đơn hàng
  const mutationCancelOrder = useMutation(
    (orderId: string) => ordersApi.cancel(orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getOrdersByUserId", userId]);
      },
      onError: (error) => {
        console.error("Error canceling order:", error);
      },
    }
  );

  // Enrich order items with book details
  const enrichOrderItems = (items: OrderItem[]) => {
    if (!allBooks) return items;
    return items.map((item) => {
      const book = allBooks.find((b: any) => b.book_id === item.book_id);
      return {
        ...item,
        book: book || null,
      };
    });
  };

  const handleCancelOrder = (orderId: string) => {
    const confirmed = window.confirm("Bạn có chắc muốn hủy đơn hàng này không?");
    if (confirmed) {
      mutationCancelOrder.mutate(orderId);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "Chờ xử lý",
      paid: "Đã thanh toán",
      shipped: "Đang giao hàng",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "paid":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "shipped":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "delivered":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      cash: "Tiền mặt",
      credit_card: "Thẻ tín dụng",
      bank_transfer: "Chuyển khoản",
      paypal: "PayPal",
    };
    return methodMap[method] || method;
  };

  if (isLoadingOrders) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="text-center">
          <span className="text-black">Đang tải đơn hàng...</span>
        </div>
      </div>
    );
  }

  if (isErrorOrders) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="text-center py-10">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Không thể lấy thông tin đơn hàng
          </h2>
          <button
            onClick={() => navigate("/books")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 bg-transparent">
      <h1 className="text-3xl font-bold text-black mb-6">Đơn hàng của tôi</h1>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-orange-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">
                Chi tiết đơn hàng #{selectedOrder.order_id.slice(0, 8)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-black"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path fill="currentColor" d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 space-y-2">
                <p className="text-black">
                  <span className="font-semibold">Ngày đặt:</span>{" "}
                  {selectedOrder.order_date 
                    ? new Date(selectedOrder.order_date).toLocaleString("vi-VN")
                    : "Không xác định"}
                </p>
                <p className="text-black">
                  <span className="font-semibold">Phương thức thanh toán:</span>{" "}
                  {getPaymentMethodText(selectedOrder.payment_method)}
                </p>
                <p className="text-black">
                  <span className="font-semibold">Trạng thái:</span>{" "}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </p>
              </div>

              <div className="border-t border-orange-200 pt-4">
                <h3 className="text-lg font-semibold text-black mb-4">Sản phẩm</h3>
                <div className="space-y-4">
                  {enrichOrderItems(selectedOrder.items).map((item) => (
                    <div
                      key={item.order_item_id}
                      className="flex items-center gap-4 p-4 border border-orange-200 rounded-lg bg-white"
                    >
                      {item.book?.cover_image ? (
                        <img
                          src={item.book.cover_image}
                          alt={item.book.title}
                          className="w-20 h-20 object-cover rounded border border-orange-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 border border-orange-200 rounded flex items-center justify-center">
                          <span className="text-black/60 text-xs">No Image</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-black">
                          {item.book?.title || "Sách đã bị xóa"}
                        </p>
                        <p className="text-sm text-black/60">Số lượng: {item.quantity}</p>
                        <p className="text-sm text-black/60">Đơn giá: {item.price.toLocaleString("vi-VN")} VND</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">
                          {(item.quantity * item.price).toLocaleString("vi-VN")} VND
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-orange-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-black">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {selectedOrder.total_amount.toLocaleString("vi-VN")} VND
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách đơn hàng */}
      <div className="space-y-6">
        {ordersData && ordersData.length > 0 ? (
          ordersData.map((order: Order) => (
            <div
              key={order.order_id}
              className="border border-orange-200 rounded-lg p-6 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-black mb-2">
                    Đơn hàng #{order.order_id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-black/60">
                    Ngày đặt: {order.order_date 
                      ? new Date(order.order_date).toLocaleString("vi-VN")
                      : "Không xác định"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="mb-4 space-y-2">
                <p className="text-black">
                  <span className="font-semibold">Tổng tiền:</span>{" "}
                  <span className="text-orange-600 font-bold">
                    {order.total_amount.toLocaleString("vi-VN")} VND
                  </span>
                </p>
                <p className="text-black">
                  <span className="font-semibold">Phương thức thanh toán:</span>{" "}
                  {getPaymentMethodText(order.payment_method)}
                </p>
                <p className="text-black">
                  <span className="font-semibold">Số sản phẩm:</span> {order.items.length}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
                >
                  Xem chi tiết
                </button>
                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order.order_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    Hủy đơn
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-black text-lg mb-4">Bạn chưa có đơn hàng nào.</p>
            <button
              onClick={() => navigate("/books")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDonHang;
