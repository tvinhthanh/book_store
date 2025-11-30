import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../services/api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { usersApi } from "../services/users.service";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(usersApi.register, {
    onSuccess: async () => {
      showToast({ message: "Đăng ký thành công!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/login");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: "user"
    };

    mutation.mutate(payload);
  });

  return (
    <form
      className="flex flex-col gap-4 p-6 max-w-md mx-auto bg-[#F8F1E8] shadow-lg rounded-lg"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl font-bold text-center text-[#6B4F3A]">Tạo tài khoản</h2>

      <div className="flex gap-4">
        <label className="flex-1 text-sm font-medium">
          Họ
          <input
            className="border rounded w-full py-2 px-3 mt-1"
            {...register("firstName", { required: "Không được bỏ trống" })}
          />
          {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
        </label>

        <label className="flex-1 text-sm font-medium">
          Tên
          <input
            className="border rounded w-full py-2 px-3 mt-1"
            {...register("lastName", { required: "Không được bỏ trống" })}
          />
          {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
        </label>
      </div>

      <label className="text-sm font-medium">
        Email
        <input
          type="email"
          className="border rounded w-full py-2 px-3 mt-1"
          {...register("email", { required: "Không được bỏ trống" })}
        />
      </label>

      <label className="text-sm font-medium">
        Số điện thoại
        <input
          type="tel"
          className="border rounded w-full py-2 px-3 mt-1"
          {...register("phone", { required: "Không được bỏ trống" })}
        />
      </label>

      <label className="text-sm font-medium">
        Mật khẩu
        <input
          type="password"
          className="border rounded w-full py-2 px-3 mt-1"
          {...register("password", {
            required: "Không được bỏ trống",
            minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
          })}
        />
      </label>

      <label className="text-sm font-medium">
        Nhập lại mật khẩu
        <input
          type="password"
          className="border rounded w-full py-2 px-3 mt-1"
          {...register("confirmPassword", {
            validate: (val) => val === watch("password") || "Mật khẩu không trùng khớp",
          })}
        />
      </label>

      <button
        className="bg-[#6B4F3A] text-white py-2 mt-3 rounded hover:bg-[#593F2D] transition"
      >
        Tạo Tài Khoản
      </button>
    </form>
  );
};

export default Register;
