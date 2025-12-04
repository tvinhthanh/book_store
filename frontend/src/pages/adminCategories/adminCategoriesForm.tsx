/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { categoriesApi } from "../../services/categories.service";

type CategoryFormValues = {
  name: string;
  description?: string;
};

const AdminCategoryForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<CategoryFormValues>();

  // Nếu edit thì load data cũ
  const { data: category, isLoading } = useQuery(
    ["admin-category", id],
    () => categoriesApi.getById(id as string),
    {
      enabled: isEdit,
    }
  );

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category, reset]);

  const mutation = useMutation(
    (formData: CategoryFormValues) => {
      if (isEdit) {
        return categoriesApi.update(id as string, formData);
      }
      return categoriesApi.create(formData);
    },
    {
      onSuccess: () => {
        navigate("/admin/categories");
      },
    }
  );

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values);
  });

  if (isEdit && isLoading) {
    return <div>Đang tải thông tin danh mục...</div>;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto"
    >
      <h2 className="font-bold text-lg mb-4">
        {isEdit ? "Cập nhật danh mục" : "Thêm danh mục mới"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tên danh mục</label>
        <input
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("name", { required: "Không được bỏ trống" })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          className="border rounded w-full px-3 py-2 text-sm"
          rows={3}
          {...register("description")}
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
          onClick={() => navigate("/admin/categories")}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default AdminCategoryForm;
