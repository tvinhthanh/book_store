import React from "react";
import { useQuery } from "react-query";
import { categoriesApi } from "../../services/categories.service";
import { usersApi } from "../../services/users.service";
import { booksApi } from "../../services/books.service";
import { ordersApi } from "../../services/orders.service";
import { orderItemsApi } from "../../services/order_items.service";

const HomeAdmin: React.FC = () => {
  const { data: categories, isLoading: loadingCategories } = useQuery(
    ["admin-dashboard-categories"],
    categoriesApi.getAll
  );

  const { data: users, isLoading: loadingUsers } = useQuery(
    ["admin-dashboard-users"],
    usersApi.getAll
  );

  const { data: books, isLoading: loadingBooks } = useQuery(
    ["admin-dashboard-books"],
    booksApi.getAll
  );

  const { data: orders, isLoading: loadingOrders } = useQuery(
    ["admin-dashboard-orders"],
    ordersApi.getAll
  );

  const { data: orderItems, isLoading: loadingOrderItems } = useQuery(
    ["dashboard-order-items"],
    orderItemsApi.getAll
  );

  const isLoading =
    loadingCategories ||
    loadingUsers ||
    loadingBooks ||
    loadingOrders ||
    loadingOrderItems;

  const categoriesCount = Array.isArray(categories) ? categories.length : 0;

  const customersCount = Array.isArray(users)
    ? users.filter((u: any) => u.role === "user").length
    : 0;

  const productsCount = Array.isArray(books) ? books.length : 0;

  const ordersCount = Array.isArray(orders) ? orders.length : 0;

  const stats = [
    { label: "Danh mục", value: categoriesCount, color: "bg-blue-500" },
    { label: "Khách hàng", value: customersCount, color: "bg-green-500" },
    { label: "Sản phẩm", value: productsCount, color: "bg-indigo-500" },
    { label: "Đơn hàng", value: ordersCount, color: "bg-orange-500" },
  ];

  let latestOrders: any[] = [];
  if (Array.isArray(orders)) {
    latestOrders = [...orders].slice(-5).reverse();
  }

  type SalesRow = {
    bookId: string;
    totalSold: number;
    title: string;
  };

  let topSelling: SalesRow[] = [];

  if (Array.isArray(orderItems) && Array.isArray(books)) {
    const salesMap = new Map<string, number>();

    for (const item of orderItems as any[]) {
      const productId = item.book_id || item.product_id;
      if (!productId) continue;

      const qty = Number(item.quantity) || 0;
      const prev = salesMap.get(productId) || 0;
      salesMap.set(productId, prev + qty);
    }

    const rows: SalesRow[] = [];
    salesMap.forEach((totalSold, bookId) => {
      const book = (books as any[]).find((b) => b.book_id === bookId);
      rows.push({
        bookId,
        totalSold,
        title: book?.title || bookId,
      });
    });

    topSelling = rows.sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Tổng quan hệ thống</h1>

      {isLoading && (
        <p className="text-black text-sm mb-4">
          Đang tải số liệu thống kê...
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-5 flex items-center gap-4"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full text-white text-xl font-bold ${item.color}`}
            >
              {isLoading ? "..." : item.value}
            </div>
            <div>
              <p className="text-black text-sm">Tổng số</p>
              <h2 className="text-lg font-semibold text-black">{item.label}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-black">Đơn hàng mới</h3>
          <p className="text-black text-sm">Chưa có dữ liệu...</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-black">Sản phẩm bán chạy</h3>
          <p className="text-black text-sm">Chưa có dữ liệu...</p>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
