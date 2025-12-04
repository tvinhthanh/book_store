/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../../services/orders.service";
import { usersApi } from "../../services/users.service";
import { booksApi } from "../../services/books.service";
import { useAppContext } from "../../contexts/AppContext";

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

const MyCart: React.FC = () => {
  const { userId } = useAppContext();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItemFull[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("money");
  const [userData, setUserData] = useState<any>(null);

  // --------------------------
  // LOAD CART + MERGE PRODUCT INFO
  // --------------------------
  useEffect(() => {
    const cartLS = localStorage.getItem("cart");
    if (!cartLS) return;

    const parsedCart: CartItemLS[] = JSON.parse(cartLS);

    const load = async () => {
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
    };

    load();
  }, []);

  // --------------------------
  // LOAD USER DATA
  // --------------------------
  useEffect(() => {
    if (!userId) return;

    usersApi
      .getUser(userId)
      .then((res) => setUserData(res))
      .catch(() => {});
  }, [userId]);

  // --------------------------
  // SAVE CART TO LOCALSTORAGE
  // --------------------------
  const saveCart = (newCart: CartItemFull[]) => {
    setCart(newCart);

    const converted = newCart.map((item) => ({
      book_id: item.book_id,
      quantity: item.quantity,
      price: item.price,
    }));

    localStorage.setItem("cart", JSON.stringify(converted));
  };

  // --------------------------
  // REMOVE ITEM
  // --------------------------
  const handleRemoveItem = (book_id: string) => {
    const updated = cart.filter((i) => i.book_id !== book_id);
    saveCart(updated);
  };

  // --------------------------
  // UPDATE QUANTITY
  // --------------------------
  const updateQuantity = (book_id: string, delta: number) => {
    const updated = cart.map((item) =>
      item.book_id === book_id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );

    saveCart(updated);
  };

  // --------------------------
  // CLEAR CART
  // --------------------------
  const clearCart = () => saveCart([]);

  // --------------------------
  // TOTAL PRICE
  // --------------------------
  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --------------------------
  // CHECKOUT
  // --------------------------
  const handleCheckout = async () => {
    if (!userData?.address) {
      alert("Vui lòng cung cấp địa chỉ giao hàng");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    const orderData = {
      customer_id: userId,
      orderDate: new Date().toISOString(),
      totalAmount: getTotalPrice(),
      orderStatus: "pending",
      shippingAddress: userData.address,
      paymentMethod,
      products: JSON.stringify(cart),
    };

    try {
      await ordersApi.create(orderData);
      alert("Đặt hàng thành công!");
      clearCart();
    } catch {
      alert("Thanh toán thất bại");
    }
  };

  // --------------------------
  // UI
  // --------------------------
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-black">Giỏ hàng của bạn</h1>

      {cart.length === 0 ? (
        <p className="text-black">Giỏ hàng trống.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.book_id}
              className="border border-gray-300 rounded-lg p-4 shadow-md bg-white flex items-center space-x-6 mb-4"
            >
              {/* IMAGE */}
              <div className="w-20 h-20 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-black">No Image</span>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black">{item.product_name}</h3>
                <p className="text-black">Giá: {item.price.toLocaleString()}đ</p>
              </div>

              {/* QUANTITY */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.book_id, -1)}
                  className="px-3 py-1 bg-gray-200 rounded text-black hover:bg-gray-300"
                >
                  -
                </button>
                <p className="text-black">{item.quantity}</p>
                <button
                  onClick={() => updateQuantity(item.book_id, 1)}
                  className="px-3 py-1 bg-gray-200 rounded text-black hover:bg-gray-300"
                >
                  +
                </button>

                <p className="font-semibold text-black">
                  {(item.price * item.quantity).toLocaleString()}đ
                </p>
              </div>

              <button
                onClick={() => handleRemoveItem(item.book_id)}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                Xóa
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 float-right mb-4"
          >
            Xóa toàn bộ giỏ hàng
          </button>
        </>
      )}

      {/* TOTAL + CHECKOUT */}
      <div className="mt-10">
        <p className="text-xl font-bold text-black">
          Tổng tiền: {getTotalPrice().toLocaleString("vi-VN")}đ
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg mt-4"
        >
          Tiếp tục thanh toán
        </button>
      </div>
    </div>
  );
};

export default MyCart;
