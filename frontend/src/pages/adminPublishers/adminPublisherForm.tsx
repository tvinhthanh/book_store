/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { publishersApi } from "../../services/publishers.service";

type PublisherFormValues = {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
};

const AdminPublisherForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<PublisherFormValues>();

  // Nếu edit thì load data cũ
  const { data: publisher, isLoading } = useQuery(
    ["admin-publisher", id],
    () => publishersApi.getById(id as string),
    {
      enabled: isEdit,
    }
  );

  useEffect(() => {
    if (publisher && isEdit) {
      reset({
        name: publisher.name || "",
        address: publisher.address || "",
        email: publisher.email || "",
        phone: publisher.phone || "",
      }); 
    }
  }, [publisher, isEdit, reset]);

  const mutation = useMutation(
    (formData: PublisherFormValues) => {
      if (isEdit) {
        return publishersApi.update(id as string, formData);
      }
      return publishersApi.create(formData);
    },
    {
      onSuccess: () => {
        navigate("/admin/publishers");
      },
    }
  );

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values);
  });

  if (isEdit && isLoading) {
    return <div className="text-black">Đang tải thông tin nhà xuất bản...</div>;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto"
    >
      <h2 className="font-bold text-lg text-black mb-4">
        {isEdit ? "Cập nhật nhà xuất bản" : "Thêm nhà xuất bản mới"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Tên nhà xuất bản <span className="text-orange-600">*</span>
        </label>
        <input
          className="border border-orange-600 rounded w-full px-3 py-2 text-sm text-black placeholder:text-gray-500"
          {...register("name", { required: "Không được bỏ trống" })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Địa chỉ</label>
        <textarea
          className="border border-orange-600 rounded w-full px-3 py-2 text-sm text-black placeholder:text-gray-500"
          rows={2}
          {...register("address")}
          placeholder="Địa chỉ nhà xuất bản..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("email")}
          placeholder="example@email.com"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <input
          type="tel"
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("phone")}
          placeholder="0123456789"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          {isEdit ? "Lưu thay đổi" : "Thêm mới"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/publishers")}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default AdminPublisherForm;

