/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { usersApi } from "../services/users.service";

export default function RequireAdmin() {
  const location = useLocation();

  const { data, isLoading, isError, error } = useQuery(
    ["current-user"],
    () => usersApi.getMe(),
    {
      retry: false,
    }
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (isError) {
    const err = error as any;
    const status = err?.status || err?.response?.status;

    if (status === 401 || status === 403) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500 text-sm">
        Có lỗi xảy ra khi kiểm tra tài khoản.
      </div>
    );
  }

  const user = data as any;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
