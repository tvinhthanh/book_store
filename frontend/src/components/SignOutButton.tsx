import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { usersApi } from "../services/users.service";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast, setUserData } = useAppContext();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(usersApi.logout, {
    onSuccess: async () => {
      setUserData(null, null);
      await queryClient.invalidateQueries("validateToken");

      showToast({ message: "Đăng xuất thành công!", type: "SUCCESS" });
      navigate("/login", { replace: true });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleLogout = () => {
    if (!isLoading) mutate();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded-lg font-semibold 
        transition duration-200
        ${
          isLoading
            ? "text-gray-400 cursor-not-allowed"
            : "hover:text-red-500 text-white"
        }
      `}
    >
      {isLoading ? "Đang thoát..." : "Đăng xuất"}
    </button>
  );
};

export default SignOutButton;
