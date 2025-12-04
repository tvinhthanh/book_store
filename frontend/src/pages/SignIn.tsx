import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usersApi } from "../services/users.service";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast, setUserData } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<SignInFormData>();

  const mutation = useMutation(usersApi.login, {
    onSuccess: async (data: any) => {
      // Phòng trường hợp backend trả:
      // { message, user: { id_user, role, ... } }
      // hoặc trả thẳng { id_user, role, ... }
      const user = data?.user ?? data;

      const id_user = user?.id_user;
      const role = user?.role;

      setUserData(id_user, role);
      showToast({ message: "Đăng nhập thành công!", type: "SUCCESS" });

      await queryClient.invalidateQueries("validateToken");

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      }
    },
    onError: (error: any) => {
      const msg = error?.message || "Đăng nhập thất bại";
      showToast({ message: msg, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((formData) => mutation.mutate(formData));

  return (
    <form
      className="flex flex-col gap-4 p-6 max-w-sm mx-auto bg-[#F8F1E8] shadow-lg rounded-lg"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl font-bold text-center text-[#6B4F3A]">
        Đăng nhập
      </h2>

      <label className="text-sm font-medium">
        Email
        <input
          type="email"
          className="border rounded w-full py-2 px-3 mt-1"
          {...register("email", { required: "Không được bỏ trống" })}
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

      <div className="flex justify-between items-center text-sm mt-2">
        <span>
          Chưa có tài khoản?{" "}
          <Link className="underline text-[#6B4F3A]" to="/register">
            Đăng ký
          </Link>
        </span>

        <button
          type="submit"
          className="bg-[#6B4F3A] hover:bg-[#593F2D] text-white px-4 py-2 rounded transition"
        >
          Đăng nhập
        </button>
      </div>
    </form>
  );
};

export default SignIn;
