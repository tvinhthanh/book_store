import { NavLink } from "react-router-dom";
import {
  Home,
  Boxes,
  Package,
  ShoppingCart,
  User,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SignOutButton from "../components/SignOutButton";

const menu = [
  { label: "Dashboard", to: "/admin", icon: <Home size={20} /> },
  { label: "Sản Phẩm", to: "/admin/books", icon: <Package size={20} /> },
  { label: "Danh mục", to: "/admin/categories", icon: <Package size={20} /> },
  { label: "Đơn hàng", to: "/admin/orders", icon: <ShoppingCart size={20} /> },
  { label: "Nhà xuất bản", to: "/admin/publishers", icon: <Package size={20} /> },
  { label: "Tác giả", to: "/admin/authors", icon: <Package size={20} /> },
  { label: "Đánh giá", to: "/admin/reviews", icon: <Star size={20} /> },
  { label: "Người dùng", to: "/admin/users", icon: <User size={20} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <div
      className={`h-screen sticky top-0 bg-white border-r shadow-sm transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b">
        {!collapsed ? (
          <h1 className="text-xl font-bold text-black">Admin</h1>
        ) : (
          <span />
        )}
        <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-md text-black">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium
              ${isActive
                ? "bg-gray-100 text-black border-r-4 border-orange-500"
                : "text-black"
              }
              hover:bg-gray-100`
            }
          >
            <span>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium
              hover:bg-gray-100"
      >
        <SignOutButton />
      </div>
    </div>
  );
}
