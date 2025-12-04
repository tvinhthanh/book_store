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

  // Map payment method từ frontend sang database enum
  const mapPaymentMethod = (method: string): string => {
    const mapping: { [key: string]: string } = {
      cash: "cash",
      card: "credit_card",
      bank: "bank_transfer",
      paypal: "paypal",
    };
    return mapping[method] || "cash";
  };

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
        payment_method: mapPaymentMethod(paymentMethod),
        shipping_address: shippingAddress,
      };

      console.log("Creating order with payload:", orderPayload);
      const createdOrder = await ordersApi.create(orderPayload);
      console.log("Order created:", createdOrder);

      // Backend trả về order object với order_id
      const orderId = createdOrder?.order_id;

      if (!orderId) {
        console.error(
          "Không lấy được order_id từ response tạo đơn:",
          createdOrder
        );
        alert("Có lỗi khi tạo đơn hàng (không có order_id).");
        return;
      }

      console.log("Creating order items for order:", orderId);
      await Promise.all(
        cart.map((item) => {
          const itemData = {
            order_id: orderId,
            book_id: item.book_id,
            quantity: item.quantity,
            price: item.price,
          };
          console.log("Creating order item:", itemData);
          return orderItemsApi.create(itemData);
        })
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
    } catch (e: any) {
      console.error("Checkout error:", e);
      const errorMessage = e?.message || "Thanh toán thất bại, vui lòng thử lại";
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <p className="text-black">Đang tải dữ liệu thanh toán...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Thanh toán</h1>
        <p className="text-black">
          Giỏ hàng trống. Quay lại trang{" "}
          <span
            onClick={() => navigate("/")}
            className="text-orange-600 cursor-pointer underline hover:text-orange-700"
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
      <h1 className="text-2xl font-bold mb-6 text-black">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* THÔNG TIN NGƯỜI NHẬN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-lg shadow border border-orange-200">
            <h2 className="font-semibold mb-3 text-lg text-black">Thông tin giao hàng</h2>
            <p className="text-sm text-black">
              <span className="font-medium">Tên:</span>{" "}
              {userData?.name || "Chưa có"}
            </p>
            <p className="text-sm text-black">
              <span className="font-medium">Email:</span>{" "}
              {userData?.email || "Chưa có"}
            </p>
            <p className="text-sm text-black">
              <span className="font-medium">SĐT:</span>{" "}
              {userData?.phone || "Chưa có"}
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-black">
                Địa chỉ giao hàng
              </label>

              <textarea
                className="border border-orange-200 rounded w-full px-3 py-2 text-sm bg-transparent text-black placeholder:text-gray-400"
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
          <div className="bg-white p-5 rounded-lg shadow border border-orange-200">
            <h2 className="font-semibold mb-3 text-lg text-black">
              Phương thức thanh toán
            </h2>

            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2 text-black">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-600"
                />
                <span>Thanh toán tiền mặt khi nhận hàng</span>
              </label>

              <label className="flex items-center gap-2 text-black">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-600"
                />
                <span>Thanh toán bằng thẻ tín dụng</span>
              </label>

              <label className="flex items-center gap-2 text-black">
                <input
                  type="radio"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-600"
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>

              <label className="flex items-center gap-2 text-black">
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-600"
                />
                <span>PayPal</span>
              </label>
            </div>
          </div>
        </div>

        {/* TÓM TẮT ĐƠN HÀNG */}
        <div className="bg-white p-5 rounded-lg shadow space-y-4 border border-orange-200">
          <h2 className="font-semibold mb-3 text-lg text-black">Đơn hàng của bạn</h2>

          <div className="space-y-2 max-h-80 overflow-y-auto border-b border-orange-200 pb-3">
            {cart.map((item) => (
              <div key={item.book_id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-black">{item.product_name}</p>
                  <p className="text-black">
                    SL: {item.quantity} x {item.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <p className="font-semibold text-black">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm text-black">
            <span>Tạm tính</span>
            <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
          </div>

          <div className="flex justify-between text-base font-bold mt-2 text-black">
            <span>Tổng cộng</span>
            <span className="text-orange-600">{getTotalPrice().toLocaleString("vi-VN")}đ</span>
          </div>

          <button
            onClick={handleConfirmOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg mt-4 transition"
          >
            Xác nhận đặt hàng
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full border border-orange-200 text-black py-2 rounded-lg mt-2 hover:bg-orange-50 transition"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
