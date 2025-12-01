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
    <nav className="sticky top-0 z-40 bg-[#1f1e1c]/95 border-b border-[#3b2a1a] backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* LOGO */}
        <Link
          to="/"
          className="text-[#c8a97e] text-2xl font-black tracking-wide uppercase"
        >
          Bookstore
        </Link>

        {/* NAV */}
        <ul className="hidden md:flex flex-1 justify-center items-center gap-6 text-sm font-medium text-[#f4ede4]">
          {isLoggedIn && role === "user" && (
            <>
              {/* ✅ DROPDOWN CLICK */}
              <li className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setOpenCat((p) => !p)}
                  className="flex items-center gap-1 hover:text-[#c8a97e]"
                >
                  Thể loại <AiOutlineDown size={12} />
                </button>

                {openCat && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-[#1f1e1c] border border-[#3b2a1a] rounded-xl shadow-xl overflow-hidden">
                    {categories.map((cat) => (
                      <button
                        key={cat.category_id}
                        onClick={() => handleCategoryClick(cat.category_id)}
                        className="w-full text-left px-4 py-2 text-sm text-[#f4ede4] hover:bg-[#c8a97e]/10 hover:text-[#c8a97e] transition"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </li>

              <li>
                <Link to="/books" className="hover:text-[#c8a97e]">
                  Sách
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#c8a97e]">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-[#c8a97e]">
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
              className="hidden sm:flex items-center bg-[#292826] border border-[#4a3a29] rounded-full px-3 py-1.5"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sách..."
                className="bg-transparent text-xs md:text-sm text-[#f4ede4] placeholder:text-[#c8a97e]/50 outline-none w-32 md:w-44"
              />
              <button type="submit" className="ml-1 text-[#c8a97e]">
                <AiOutlineSearch size={18} />
              </button>
            </form>
          )}

          {isLoggedIn ? (
            <SignOutButton />
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium bg-[#c8a97e] hover:bg-[#b48c66] text-[#2f2f2f] px-4 py-2 rounded-full"
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
