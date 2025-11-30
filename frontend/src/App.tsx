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

const App = () => {
  const { isLoggedIn, role } = useAppContext();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/login" element={<Layout><SignIn /></Layout>} />
        {/* <Route path="/product/:productId" element={<Layout><ProductDetail /></Layout>} /> */}

        {isLoggedIn && (
          <>
            {role === "user" && (
              <>
                <Route path="/cart" element={<Layout><MyCart /></Layout>} />
                <Route path="/my-orders" element={<Layout><UserOrdersPage /></Layout>} />
              </>
            )}

            {role === "admin" && (
              <>
                <Route path="/books" element={<Layout><BooksPage /></Layout>} />
                <Route path="/publishers" element={<Layout><PublishersPage /></Layout>} />
                <Route path="/authors" element={<Layout><AuthorsPage /></Layout>} />
                <Route path="/categories" element={<Layout><Danhmuc /></Layout>} />

                {/* <Route path="/orders" element={<Layout><OrdersAdminPage /></Layout>} /> */}
              </>
            )}
          </>
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
