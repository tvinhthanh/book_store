/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { useAppContext } from "../contexts/AppContext";
import { categoriesApi } from "../services/categories.service";
import SignOutButton from "./SignOutButton";

interface Category {
  category_id: string;
  name: string;
}

const Header = () => {
  const { isLoggedIn, role } = useAppContext();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCat, setOpenCat] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    categoriesApi
      .getAll()
      .then(setCategories)
      .catch(() => {});
  }, []);

  // ✅ CLICK NGOÀI → ĐÓNG DROPDOWN
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenCat(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?query=${search}`);
  };

  const handleCategoryClick = (id: string) => {
    navigate(`/the-loai/${id}`);
    setOpenCat(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-orange-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* LOGO */}
        <Link
          to="/"
          className="text-orange-600 text-2xl font-black tracking-wide uppercase"
        >
          Bookstore
        </Link>

        {/* NAV */}
        <ul className="hidden md:flex flex-1 justify-center items-center gap-6 text-sm font-medium text-gray-800">
          {isLoggedIn && role === "user" && (
            <>
              {/* ✅ DROPDOWN CLICK */}
              <li className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setOpenCat((p) => !p)}
                  className="flex items-center gap-1 hover:text-orange-600"
                >
                  Thể loại <AiOutlineDown size={12} />
                </button>

                {openCat && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-transparent border border-orange-200 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm">
                    {categories.map((cat) => (
                      <button
                        key={cat.category_id}
                        onClick={() => handleCategoryClick(cat.category_id)}
                        className="w-full text-left px-4 py-2 text-sm text-black hover:bg-orange-50 hover:text-orange-600 transition bg-white/95"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </li>

              <li>
                <Link to="/books" className="hover:text-orange-600">
                  Sách
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-orange-600">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-orange-600">
                  Đơn hàng
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* SEARCH + AUTH */}
        <div className="flex items-center gap-3 ml-auto">
          {!(isLoggedIn && role === "admin") && (
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-center bg-white border border-orange-300 rounded-full px-3 py-1.5 shadow-sm"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sách..."
                className="bg-transparent text-xs md:text-sm text-gray-800 placeholder:text-orange-400 outline-none w-32 md:w-44"
              />
              <button type="submit" className="ml-1 text-orange-500 hover:text-orange-600">
                <AiOutlineSearch size={18} />
              </button>
            </form>
          )}

          {isLoggedIn ? (
            <SignOutButton />
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-sm"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
