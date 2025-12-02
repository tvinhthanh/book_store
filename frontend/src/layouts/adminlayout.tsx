/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../pages/adminSidebar";
import AdminTopbar from "../pages/adminTobar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getTitle = (pathname: string) => {
    if (pathname.includes("/admin/categories")) return "Quản lý danh mục";
    if (pathname.includes("/admin/products")) return "Quản lý sản phẩm";
    if (pathname.includes("/admin/variants")) return "Quản lý biến thể";
    if (pathname.includes("/admin/orders")) return "Quản lý đơn hàng";
    if (pathname.includes("/admin/customers")) return "Quản lý khách hàng";
    if (pathname.includes("/admin/reviews")) return "Quản lý đánh giá";
    return "Dashboard";
  };

  const title = getTitle(location.pathname);

  return (
    <div className="w-full min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <AdminTopbar title={title} />

        {/* CONTENT */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
