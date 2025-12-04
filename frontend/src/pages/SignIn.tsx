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

  const { register, handleSubmit, formState: { errors }  } = useForm<SignInFormData>();

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
      className="flex flex-col border border-orange-600 rounded gap-4 p-6 max-w-sm mx-auto bg-[#F8F1E8] shadow-lg rounded-lg"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl font-bold text-center text-orange-600">
        Đăng nhập
      </h2>

      <label className="text-sm font-medium">
        Email
        <input
          type="email"
          className="bg-transparent border border-orange-600 rounded w-full py-2 px-3 mt-1 text-black placeholder:text-gray-500"
          {...register("email", { required: "Không được bỏ trống", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email không hợp lệ" } })}
          placeholder="example@email.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </label>

      <label className="text-sm font-medium">
        Mật khẩu
        <input
          type="password"
          className="bg-transparent border border-orange-600 rounded w-full py-2 px-3 mt-1 text-black placeholder:text-gray-500"
          {...register("password", {
            required: "Không được bỏ trống",
            validate: (value) => {
              if (value.length < 6) {
                return "Mật khẩu phải có ít nhất 6 ký tự";
              }
              return true;
            },  
            minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
          })}
          placeholder="********"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </label>

      <div className="flex justify-between items-center text-sm mt-2">
        <span>
          Chưa có tài khoản?{" "}
          <Link className="underline text-orange-600 hover:text-orange-700" to="/register">
            Đăng ký
          </Link>
        </span>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
        >
          Đăng nhập
        </button>
      </div>
    </form>
  );
};

export default SignIn;
