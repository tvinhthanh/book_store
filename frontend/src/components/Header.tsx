/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn, role } = useAppContext();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?query=${search}`);
  };

  return (
    <nav className="bg-[#2F2F2F] border-b border-[#6B4F3A]/40 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        <div className="text-[#C8A97E] text-3xl font-extrabold tracking-wide">
          <Link to="/" className="hover:text-white transition">Bookstore</Link>
        </div>

        <ul className="hidden md:flex flex-1 justify-center space-x-8 text-[#F4EDE4] font-medium">

          {isLoggedIn && role === "user" && (
            <>
              <li><Link to="/books" className="hover:text-[#C8A97E]">Sách</Link></li>
              <li><Link to="/cart" className="hover:text-[#C8A97E]">Giỏ hàng</Link></li>
              <li><Link to="/my-orders" className="hover:text-[#C8A97E]">Đơn hàng của tôi</Link></li>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <>
              <li><Link to="/orders" className="hover:text-[#C8A97E]">Đơn hàng</Link></li>
              <li><Link to="/customers" className="hover:text-[#C8A97E]">Khách hàng</Link></li>
              <li><Link to="/admin" className="hover:text-[#C8A97E]">Quản trị</Link></li>
              <li><Link to="/publishers" className="hover:text-[#C8A97E]">Nhà xuất bản</Link></li>
              <li><Link to="/books" className="hover:text-[#C8A97E]">Sách</Link></li>
              <li><Link to="/authors" className="hover:text-[#C8A97E]">Tác giả</Link></li>
              <li><Link to="/categories" className="hover:text-[#C8A97E]">Danh mục</Link></li>

            </>
          )}
        </ul>

        <div className="flex items-center gap-4">
          {/* 
          {!(isLoggedIn && role === "admin") && (
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sách..."
                className="
                  bg-transparent
                  border-b border-[#C8A97E]/50
                  focus:border-[#C8A97E]
                  text-[#F4EDE4]
                  placeholder-[#C8A97E]/50
                  outline-none
                  w-36 md:w-52
                  pr-7
                  py-1
                  transition-all
                "
              />
              <button className="absolute right-0 text-[#C8A97E] hover:text-white transition">
                <FiSearch size={18} />
              </button>
            </form>
          )} */}

          {isLoggedIn ? (
            // <Link
            //   to="/logout"
            //   className="bg-[#6B4F3A] hover:bg-[#593F2D] px-4 py-2 rounded-lg text-white shadow-sm transition"
            // >
            //   Đăng xuất
            // </Link>
            <SignOutButton />
          ) : (
            <Link
              to="/login"
              className="bg-[#C8A97E] hover:bg-[#B38E6A] px-4 py-2 rounded-lg text-[#2F2F2F] shadow-sm transition"
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
