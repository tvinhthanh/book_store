import React from "react";
import { useQuery } from "react-query";
import { categoriesApi } from "../../services/categories.service";
import { usersApi } from "../../services/users.service";
import { booksApi } from "../../services/books.service";
import { ordersApi } from "../../services/orders.service";
import { orderItemsApi } from "../../services/order_items.service";
import { authorsApi } from "../../services/authors.service";
import { publishersApi } from "../../services/publishers.service";
import { reviewsApi } from "../../services/reviews.service";
import {
  Book,
  Package,
  User,
  Star,
  ShoppingCart,
  Building2,
  FileText,
} from "lucide-react";

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

  const { data: authors } = useQuery(["all-authors"], authorsApi.getAll);
  const { data: publishers } = useQuery(["all-publishers"], publishersApi.getAll);
  const { data: reviews } = useQuery(["all-reviews"], reviewsApi.getAll);

  const isLoading =
    loadingCategories ||
    loadingUsers ||
    loadingBooks ||
    loadingOrders ||
    loadingOrderItems;

  // Calculate statistics
  const totalBooks = Array.isArray(books) ? books.length : 0;
  const totalCategories = Array.isArray(categories) ? categories.length : 0;
  const totalAuthors = Array.isArray(authors) ? authors.length : 0;
  const totalPublishers = Array.isArray(publishers) ? publishers.length : 0;
  const totalReviews = Array.isArray(reviews) ? reviews.length : 0;
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const totalOrders = Array.isArray(orders) ? orders.length : 0;

  const customersCount = Array.isArray(users)
    ? users.filter((u: any) => u.role === "user").length
    : 0;

  // Calculate total stock value
  const totalStockValue = Array.isArray(books)
    ? books.reduce(
        (sum: number, book: any) =>
          sum + parseFloat(book.price || 0) * (book.stock_quantity || 0),
        0
      )
    : 0;

  // Calculate total orders value
  const totalOrdersValue = Array.isArray(orders)
    ? orders.reduce(
        (sum: number, order: any) => sum + parseFloat(order.total_amount || 0),
        0
      )
    : 0;

  // Calculate average rating
  const averageRating =
    Array.isArray(reviews) && reviews.length > 0
      ? (
          reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // Count users by role
  const adminUsers = Array.isArray(users)
    ? users.filter((u: any) => u.role === "admin").length
    : 0;
  const regularUsers = Array.isArray(users)
    ? users.filter((u: any) => u.role === "user").length
    : 0;

  // Count orders by status
  const pendingOrders = Array.isArray(orders)
    ? orders.filter((o: any) => o.status === "pending").length
    : 0;
  const paidOrders = Array.isArray(orders)
    ? orders.filter((o: any) => o.status === "paid").length
    : 0;
  const shippedOrders = Array.isArray(orders)
    ? orders.filter((o: any) => o.status === "shipped").length
    : 0;
  const deliveredOrders = Array.isArray(orders)
    ? orders.filter((o: any) => o.status === "delivered").length
    : 0;

  // Latest orders
  let latestOrders: any[] = [];
  if (Array.isArray(orders)) {
    latestOrders = [...orders]
      .sort((a: any, b: any) => {
        const dateA = new Date(a.order_date || 0).getTime();
        const dateB = new Date(b.order_date || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }

  // Top selling books
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

  const stats = [
    { label: "Danh mục", value: totalCategories, color: "bg-blue-500", icon: <Package size={24} /> },
    { label: "Khách hàng", value: customersCount, color: "bg-green-500", icon: <User size={24} /> },
    { label: "Sản phẩm", value: totalBooks, color: "bg-indigo-500", icon: <Book size={24} /> },
    { label: "Đơn hàng", value: totalOrders, color: "bg-orange-500", icon: <ShoppingCart size={24} /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black">Tổng quan hệ thống</h1>

      {isLoading && (
        <p className="text-black text-sm mb-4">Đang tải số liệu thống kê...</p>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-5 flex items-center gap-4"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full text-white ${item.color}`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-black text-sm">Tổng số</p>
              <h2 className="text-lg font-semibold text-black">{item.label}</h2>
              <p className="text-2xl font-bold text-black">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-black mb-4">Tổng quan tài chính</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <span className="text-black font-medium">Tổng giá trị kho:</span>
            <span className="text-xl font-bold text-black">
              {parseFloat(totalStockValue.toString()).toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span className="text-black font-medium">Tổng giá trị đơn hàng:</span>
            <span className="text-xl font-bold text-black">
              {parseFloat(totalOrdersValue.toString()).toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>

      {/* Latest Orders & Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-black">Đơn hàng mới nhất</h3>
          {latestOrders.length > 0 ? (
            <div className="space-y-3">
              {latestOrders.map((order: any) => (
                <div
                  key={order.order_id}
                  className="flex justify-between items-center p-3 border-b border-gray-200"
                >
                  <div>
                    <p className="text-sm font-medium text-black">
                      #{order.order_id.slice(0, 8)}...
                    </p>
                    <p className="text-xs text-black/60">
                      {order.customer_name || order.customer_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-black">
                      {parseFloat(order.total_amount || 0).toLocaleString("vi-VN")}₫
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "paid" || order.status === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status === "pending" && "Chờ xử lý"}
                      {order.status === "paid" && "Đã thanh toán"}
                      {order.status === "shipped" && "Đang giao"}
                      {order.status === "delivered" && "Đã giao"}
                      {order.status === "cancelled" && "Đã hủy"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black text-sm">Chưa có đơn hàng nào.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-black">Sản phẩm bán chạy</h3>
          {topSelling.length > 0 ? (
            <div className="space-y-3">
              {topSelling.map((item) => (
                <div
                  key={item.bookId}
                  className="flex justify-between items-center p-3 border-b border-gray-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black truncate">
                      {item.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-black">
                      {item.totalSold} cuốn
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black text-sm">Chưa có dữ liệu bán hàng.</p>
          )}
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-black/60">Tác giả</p>
              <p className="text-xl font-bold text-black">{totalAuthors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building2 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-black/60">Nhà xuất bản</p>
              <p className="text-xl font-bold text-black">{totalPublishers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-black/60">Đánh giá</p>
              <p className="text-xl font-bold text-black">{totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-black/60">Người dùng</p>
              <p className="text-xl font-bold text-black">{totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-black mb-4">Thống kê đơn hàng</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{pendingOrders}</p>
            <p className="text-sm text-black/60">Chờ xử lý</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{paidOrders}</p>
            <p className="text-sm text-black/60">Đã thanh toán</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{shippedOrders}</p>
            <p className="text-sm text-black/60">Đang vận chuyển</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-black">{deliveredOrders}</p>
            <p className="text-sm text-black/60">Đã giao hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
