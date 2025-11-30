import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { usersApi } from "../services/users.service";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast, setUserData } = useAppContext();

  const { mutate, isLoading } = useMutation(usersApi.logout, {
    onSuccess: async () => {
      // Xóa dữ liệu user trong context
      setUserData(null, null);

      // Reset token
      await queryClient.invalidateQueries("validateToken");

      showToast({ message: "Đăng xuất thành công!", type: "SUCCESS" });
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
        ${isLoading
          ? "text-gray-400 cursor-not-allowed"
          : "hover:text-red-500 text-white"}
      `}
    >
      {isLoading ? "Đang thoát..." : "Đăng xuất"}
    </button>
  );
};

export default SignOutButton;
