import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./contexts/AppContext";

import Home from "./pages/Home";
import MyCart from "./pages/cart/MyCart";
import BookDetail from "./pages/BookDetail";
import CategoryBooks from "./components/CategoriesBook";
import UserBooksPage from "./pages/BooksPage";

// ADMIN PAGES
// import BooksPage from "./pages/books/BooksPage";
// import PublishersPage from "./pages/publishers/PublishersPage";
// import OrdersAdminPage from "./pages/orders/OrdersAdminPage";

// USER PAGES
import UserOrdersPage from "./pages/donhang/mydonhang";
import PublishersPage from "./pages/nhaxuatban/Nhaxuatban";
import AuthorsPage from "./pages/tacgia/Tacgia";
import Danhmuc from "./pages/danhmuc/Danhmuc";
import BooksPage from "./pages/sach/Sach";

// import RequireAdmin from "./components/RequireAdmin";
import AdminLayout from "./layouts/adminlayout";
import HomeAdmin from "./pages/admin/homeadmin";
import RequireAdmin from "./pages/requireAdmin";
import AdminBooksPage from "./pages/product/adminBookPage";
import AdminBookForm from "./pages/product/adminBookForm";
import AdminCategoriesPage from "./pages/adminCategories/adminCategoriesPage";
import AdminCategoryForm from "./pages/adminCategories/adminCategoriesForm";
import AdminOrdersPage from "./pages/adminOrders/adminOrderPage";
import AdminOrderForm from "./pages/adminOrders/adminOrderForm";
import AdminUsersPage from "./pages/adminUser/adminUserPage";
import AdminUserForm from "./pages/adminUser/adminUserForm";
import AdminAuthorsPage from "./pages/adminAuthors/adminAuthorPage";
import AdminAuthorForm from "./pages/adminAuthors/adminAuthorForm";
import AdminPublishersPage from "./pages/adminPublishers/adminPublisherPage";
import AdminPublisherForm from "./pages/adminPublishers/adminPublisherForm";
import AdminReviewsPage from "./pages/adminReviews/adminReviewPage";
import AdminReviewForm from "./pages/adminReviews/adminReviewForm";
import AdminSettings from "./pages/adminSettings/adminSettings";
import Checkout from "./pages/cart/checkOut";

const App = () => {
  const { isLoggedIn, role } = useAppContext();

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            isLoggedIn && role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Layout>
                <Home />
              </Layout>
            )
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        <Route
          path="/books"
          element={
            <Layout>
              <UserBooksPage />
            </Layout>
          }
        />
        <Route
          path="/books/:id"
          element={
            <Layout>
              <BookDetail />
            </Layout>
          }
        />

        {isLoggedIn && role === "user" && (
          <>
            <Route
              path="/cart"
              element={
                <Layout>
                  <MyCart />
                </Layout>
              }
            />
            <Route
              path="/checkout"
              element={
                <Layout>
                  <Checkout />
                </Layout>
              }
            />
            <Route
              path="/my-orders"
              element={
                <Layout>
                  <UserOrdersPage />
                </Layout>
              }
            />
            <Route
              path="/the-loai/:id"
              element={
                <Layout>
                  <CategoryBooks />
                </Layout>
              }
            />
          </>
        )}

        <Route path="/admin" element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<HomeAdmin />} />

            <Route path="books" element={<AdminBooksPage />} />
            <Route path="books/create" element={<AdminBookForm />} />

            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="categories/create" element={<AdminCategoryForm />} />
            <Route path="categories/:id" element={<AdminCategoryForm />} />

            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderForm />} />

            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/create" element={<AdminUserForm />} />
            <Route path="users/:id" element={<AdminUserForm />} />

            <Route path="authors" element={<AdminAuthorsPage />} />
            <Route path="authors/create" element={<AdminAuthorForm />} />
            <Route path="authors/:id" element={<AdminAuthorForm />} />

            <Route path="publishers" element={<AdminPublishersPage />} />
            <Route path="publishers/create" element={<AdminPublisherForm />} />
            <Route path="publishers/:id" element={<AdminPublisherForm />} />

            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="reviews/:id" element={<AdminReviewForm />} />

            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
