/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ordersApi } from "../../services/orders.service";

type OrderFormValues = {
  customer_id: string;
  total_amount: number;
  payment_method: string;
  status: string;
};

const AdminOrderForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<OrderFormValues>();

  // Nếu edit thì load dữ liệu đơn hàng
  const { data: order, isLoading } = useQuery(
    ["admin-order", id],
    () => ordersApi.getById(id as string),
    {
      enabled: isEdit,
    }
  );

  useEffect(() => {
    if (order) {
      reset({
        customer_id: order.customer_id || "",
        total_amount: order.total_amount || 0,
        payment_method: order.payment_method || "cash",
        status: order.status || "pending",
      });
    }
  }, [order, reset]);

  const mutation = useMutation(
    (values: OrderFormValues) => {
      if (isEdit) return ordersApi.update(id as string, values);
      // Nếu muốn cho admin tạo đơn thì cho phép create
      return ordersApi.create(values);
    },
    {
      onSuccess: () => {
        navigate("/admin/orders");
      },
    }
  );

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values);
  });

  if (isEdit && isLoading) {
    return <div>Đang tải thông tin đơn hàng...</div>;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto"
    >
      <h2 className="font-bold text-lg mb-4">
        {isEdit ? "Cập nhật đơn hàng" : "Tạo đơn hàng mới"}
      </h2>

      {isEdit && (
        <div className="mb-4 text-sm text-gray-500">
          Mã đơn hàng: <span className="font-mono">{id}</span>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Mã khách hàng (customer_id)
        </label>
        <input
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("customer_id", { required: true })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tổng tiền</label>
        <input
          type="number"
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("total_amount", { required: true, valueAsNumber: true })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Phương thức thanh toán
        </label>
        <select
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("payment_method", { required: true })}
        >
          <option value="cash">Tiền mặt</option>
          <option value="card">Thẻ</option>
          <option value="transfer">Chuyển khoản</option>
          {/* nếu DB bạn lưu kiểu khác thì chỉnh lại value cho khớp */}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Trạng thái đơn hàng
        </label>
        <select
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("status", { required: true })}
        >
          <option value="pending">Chờ xử lý</option>
          <option value="processing">Đang xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          {isEdit ? "Lưu thay đổi" : "Tạo đơn"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default AdminOrderForm;
