/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "react-query";
import { booksApi } from "../../services/books.service";
import { categoriesApi } from "../../services/categories.service";
import { authorsApi } from "../../services/authors.service";
import { publishersApi } from "../../services/publishers.service";
import { reviewsApi } from "../../services/reviews.service";
import { usersApi } from "../../services/users.service";
import { ordersApi } from "../../services/orders.service";
import {
  Book,
  Package,
  User,
  Star,
  ShoppingCart,
  Building2,
  FileText,
} from "lucide-react";

const AdminSettings = () => {
  const { data: books = [] } = useQuery(["all-books"], booksApi.getAll);
  const { data: categories = [] } = useQuery(
    ["all-categories"],
    categoriesApi.getAll
  );
  const { data: authors = [] } = useQuery(["all-authors"], authorsApi.getAll);
  const { data: publishers = [] } = useQuery(
    ["all-publishers"],
    publishersApi.getAll
  );
  const { data: reviews = [] } = useQuery(["all-reviews"], reviewsApi.getAll);
  const { data: users = [] } = useQuery(["all-users"], usersApi.getAll);
  const { data: orders = [] } = useQuery(["all-orders"], ordersApi.getAll);

  // Calculate statistics
  const totalBooks = books.length;
  const totalCategories = categories.length;
  const totalAuthors = authors.length;
  const totalPublishers = publishers.length;
  const totalReviews = reviews.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;

  // Calculate total stock value
  const totalStockValue = books.reduce(
    (sum: number, book: any) =>
      sum + (book.price || 0) * (book.stock_quantity || 0),
    0
  );

  // Calculate total orders value
  const totalOrdersValue = orders.reduce(
    (sum: number, order: any) => sum + (order.total_amount || 0),
    0
  );

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // Count users by role
  const adminUsers = users.filter((u: any) => u.role === "admin").length;
  const regularUsers = users.filter((u: any) => u.role === "user").length;

  // Count orders by status
  const pendingOrders = orders.filter(
    (o: any) => o.status === "pending"
  ).length;
  const paidOrders = orders.filter((o: any) => o.status === "paid").length;
  const shippedOrders = orders.filter(
    (o: any) => o.status === "shipped"
  ).length;
  const deliveredOrders = orders.filter(
    (o: any) => o.status === "delivered"
  ).length;

  const stats = [
    {
      title: "Tổng số sách",
      value: totalBooks,
      icon: <Book className="w-8 h-8" />,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Tổng danh mục",
      value: totalCategories,
      icon: <Package className="w-8 h-8" />,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Tổng tác giả",
      value: totalAuthors,
      icon: <FileText className="w-8 h-8" />,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Tổng nhà xuất bản",
      value: totalPublishers,
      icon: <Building2 className="w-8 h-8" />,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Tổng đánh giá",
      value: totalReviews,
      icon: <Star className="w-8 h-8" />,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Tổng người dùng",
      value: totalUsers,
      icon: <User className="w-8 h-8" />,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "Tổng đơn hàng",
      value: totalOrders,
      icon: <ShoppingCart className="w-8 h-8" />,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-black mb-6">
          Thông tin hệ thống
        </h2>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} p-6 rounded-lg border-2 border-transparent hover:border-gray-200 transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-sm font-medium text-black mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-black">
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-black mb-4">
              Tổng quan tài chính
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">Tổng giá trị kho:</span>
                <span className="text-xl font-bold text-black">
                  {totalStockValue.toLocaleString()}₫
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Tổng giá trị đơn hàng:</span>
                <span className="text-xl font-bold text-black">
                  {totalOrdersValue.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>

          {/* User Statistics */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
            <h3 className="text-lg font-semibold text-black mb-4">
              Thống kê người dùng
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">Tổng người dùng:</span>
                <span className="text-xl font-bold text-black">{totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Admin:</span>
                <span className="text-xl font-bold text-black">
                  {adminUsers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Người dùng thường:</span>
                <span className="text-xl font-bold text-black">
                  {regularUsers}
                </span>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-black mb-4">
              Thống kê đơn hàng
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">Tổng đơn hàng:</span>
                <span className="text-xl font-bold text-black">{totalOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Chờ xử lý:</span>
                <span className="text-lg font-semibold text-black">
                  {pendingOrders}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Đã thanh toán:</span>
                <span className="text-lg font-semibold text-black">
                  {paidOrders}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Đã giao hàng:</span>
                <span className="text-lg font-semibold text-black">
                  {deliveredOrders}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Đang vận chuyển:</span>
                <span className="text-lg font-semibold text-black">
                  {shippedOrders}
                </span>
              </div>
            </div>
          </div>

          {/* Review Statistics */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100">
            <h3 className="text-lg font-semibold text-black mb-4">
              Thống kê đánh giá
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">Tổng đánh giá:</span>
                <span className="text-xl font-bold text-black">{totalReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Đánh giá trung bình:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-black">
                    {averageRating}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= Math.round(parseFloat(averageRating))
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-black mb-4">
            Thông tin hệ thống
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-black">Tên hệ thống:</span>
              <span className="ml-2 font-medium text-black">Book Store Management System</span>
            </div>
            <div>
              <span className="text-black">Phiên bản:</span>
              <span className="ml-2 font-medium text-black">1.0.0</span>
            </div>
            <div>
              <span className="text-black">Ngày cập nhật:</span>
              <span className="ml-2 font-medium text-black">
                {new Date().toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div>
              <span className="text-black">Trạng thái:</span>
              <span className="ml-2 font-medium text-black">Hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

