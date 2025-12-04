/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { usersApi } from "../../services/users.service";

type UserFormValues = {
  name: string;
  email: string;
  phone?: string;
  role: string;
  password?: string; // chỉ dùng khi tạo mới
};

const AdminUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { register, handleSubmit, reset } = useForm<UserFormValues>();

  // Nếu edit thì load user
  const { data: user, isLoading } = useQuery(
    ["admin-user", id],
    () => usersApi.getUser(id as string),
    {
      enabled: isEdit,
    }
  );

  useEffect(() => {
    if (user && isEdit) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "user",
      });
    }
  }, [user, isEdit, reset]);

  const mutation = useMutation(
    (values: UserFormValues) => {
      if (isEdit) {
        // UPDATE: name, phone, role (email giữ nguyên)
        const payload: any = {
          name: values.name,
          phone: values.phone,
          role: values.role,
        };
        return usersApi.update(id as string, payload);
      }

      // CREATE (register): cần name, email, password, phone, role
      const payload: any = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
      };
      return usersApi.register(payload);
    },
    {
      onSuccess: () => {
        navigate("/admin/users");
      },
    }
  );

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values);
  });

  if (isEdit && isLoading) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  const title = isEdit ? "Cập nhật người dùng" : "Tạo người dùng mới";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto"
    >
      <h2 className="font-bold text-lg mb-4">{title}</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tên</label>
        <input
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("name", { required: "Không được bỏ trống" })}
        />
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          className={`border rounded w-full px-3 py-2 text-sm ${
            isEdit ? "bg-gray-100" : ""
          }`}
          disabled={isEdit}
          {...register("email", {
            required: !isEdit ? "Không được bỏ trống" : false,
          })}
        />
      </div>

      {/* PASSWORD – chỉ khi tạo mới */}
      {!isEdit && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mật khẩu</label>
          <input
            type="password"
            className="border rounded w-full px-3 py-2 text-sm"
            {...register("password", {
              required: "Không được bỏ trống",
              minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
            })}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <input
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("phone")}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("role", { required: true })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          {isEdit ? "Lưu thay đổi" : "Tạo người dùng"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default AdminUserForm;
