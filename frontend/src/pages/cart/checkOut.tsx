/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { booksApi } from "../../services/books.service";
import { usersApi } from "../../services/users.service";
import { ordersApi } from "../../services/orders.service";
import { useAppContext } from "../../contexts/AppContext";
import { orderItemsApi } from "../../services/order_items.service";

interface CartItemLS {
  book_id: string;
  quantity: number;
  price: number;
}

interface CartItemFull {
  book_id: string;
  product_name: string;
  image: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const { userId } = useAppContext();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItemFull[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    const init = async () => {
      const cartLS = localStorage.getItem("cart");
      if (!cartLS) {
        setCart([]);
        setLoading(false);
        return;
      }

      const parsedCart: CartItemLS[] = JSON.parse(cartLS);
      const products = await booksApi.getAll();

      const merged: CartItemFull[] = parsedCart.map((item) => {
        const product = products.find((p: any) => p.book_id === item.book_id);

        return {
          book_id: item.book_id,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || Number(product?.price) || 0,
          product_name: product?.title || "Không tìm thấy thông tin",
          image: product?.cover_image || "",
        };
      });

      setCart(merged);
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (!userId) return;
    usersApi
      .getUser(userId)
      .then((res) => setUserData(res))
      .catch(() => {});
  }, [userId]);

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleConfirmOrder = async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập trước khi thanh toán");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    try {
      const orderPayload = {
        customer_id: userId,
        status: "pending",
        total_amount: getTotalPrice(),
        payment_method: paymentMethod,
      };

      const createdOrder = await ordersApi.create(orderPayload);

      const orderId =
        createdOrder.order_id ||
        createdOrder.orderId ||
        createdOrder.id ||
        createdOrder?.[0]?.order_id;

      if (!orderId) {
        console.error(
          "Không lấy được order_id từ response tạo đơn:",
          createdOrder
        );
        alert("Có lỗi khi tạo đơn hàng (không có order_id).");
        return;
      }

      await Promise.all(
        cart.map((item) =>
          orderItemsApi.create({
            order_id: orderId,
            book_id: item.book_id,
            quantity: item.quantity,
            price: item.price,
          })
        )
      );

      alert("Đặt hàng thành công!");

      // clear cart
      localStorage.removeItem("cart");
      setCart([]);

      // OPTIONAL: lưu địa chỉ vào tài khoản
      try {
        await usersApi.update(userId, { address: shippingAddress });
      } catch (err) {
        console.error("Không lưu được địa chỉ user:", err);
      }

      navigate("/my-orders");
    } catch (e) {
      console.error(e);
      alert("Thanh toán thất bại, vui lòng thử lại");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <p>Đang tải dữ liệu thanh toán...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>
        <p>
          Giỏ hàng trống. Quay lại trang{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 cursor-pointer underline"
          >
            mua sắm
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* THÔNG TIN NGƯỜI NHẬN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold mb-3 text-lg">Thông tin giao hàng</h2>
            <p className="text-sm">
              <span className="font-medium">Tên:</span>{" "}
              {userData?.name || "Chưa có"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span>{" "}
              {userData?.email || "Chưa có"}
            </p>
            <p className="text-sm">
              <span className="font-medium">SĐT:</span>{" "}
              {userData?.phone || "Chưa có"}
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Địa chỉ giao hàng
              </label>

              <textarea
                className="border rounded w-full px-3 py-2 text-sm"
                rows={3}
                placeholder="Nhập địa chỉ nhận hàng cụ thể..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />

              {!shippingAddress && (
                <p className="text-red-500 text-xs mt-1">
                  Vui lòng nhập địa chỉ để tiếp tục thanh toán
                </p>
              )}
            </div>
          </div>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="font-semibold mb-3 text-lg">
              Phương thức thanh toán
            </h2>

            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thanh toán tiền mặt khi nhận hàng</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thanh toán bằng thẻ (demo)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Chuyển khoản ngân hàng (demo)</span>
              </label>
            </div>
          </div>
        </div>

        {/* TÓM TẮT ĐƠN HÀNG */}
        <div className="bg-white p-5 rounded-lg shadow space-y-4">
          <h2 className="font-semibold mb-3 text-lg">Đơn hàng của bạn</h2>

          <div className="space-y-2 max-h-80 overflow-y-auto border-b pb-3">
            {cart.map((item) => (
              <div key={item.book_id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-gray-400">
                    SL: {item.quantity} x {item.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <p className="font-semibold">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
          </div>

          <div className="flex justify-between text-base font-bold mt-2">
            <span>Tổng cộng</span>
            <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
          </div>

          <button
            onClick={handleConfirmOrder}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700"
          >
            Xác nhận đặt hàng
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg mt-2"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
