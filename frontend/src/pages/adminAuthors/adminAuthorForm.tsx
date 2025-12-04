/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { authorsApi } from "../../services/authors.service";

type AuthorFormValues = {
  name: string;
  bio?: string;
  birth_date?: string;
  country?: string;
};

const AdminAuthorForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<AuthorFormValues>();

  // Nếu edit thì load data cũ
  const { data: author, isLoading } = useQuery(
    ["admin-author", id],
    () => authorsApi.getById(id as string),
    {
      enabled: isEdit,
    }
  );

  useEffect(() => {
    if (author && isEdit) {
      reset({
        name: author.name || "",
        bio: author.bio || "",
        birth_date: author.birth_date
          ? author.birth_date.split("T")[0]
          : "",
        country: author.country || "",
      });
    }
  }, [author, isEdit, reset]);

  const mutation = useMutation(
    (formData: AuthorFormValues) => {
      if (isEdit) {
        return authorsApi.update(id as string, formData);
      }
      return authorsApi.create(formData);
    },
    {
      onSuccess: () => {
        navigate("/admin/authors");
      },
    }
  );

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values);
  });

  if (isEdit && isLoading) {
    return <div className="text-black">Đang tải thông tin tác giả...</div>;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto"
    >
      <h2 className="font-bold text-lg text-black mb-4">
        {isEdit ? "Cập nhật tác giả" : "Thêm tác giả mới"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Tên tác giả <span className="text-orange-600">*</span>
        </label>
        <input
          className="border border-orange-600 rounded w-full px-3 py-2 text-sm text-black placeholder:text-gray-500"
          {...register("name", { required: "Không được bỏ trống" })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tiểu sử</label>
        <textarea
          className="border border-orange-600 rounded w-full px-3 py-2 text-sm text-black placeholder:text-gray-500"
          rows={4}
          {...register("bio")}
          placeholder="Giới thiệu về tác giả..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ngày sinh</label>
        <input
          type="date"
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("birth_date")}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Quốc gia</label>
        <input
          className="border rounded w-full px-3 py-2 text-sm"
          {...register("country")}
          placeholder="Ví dụ: Vietnam, USA..."
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
          onClick={() => navigate("/admin/authors")}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default AdminAuthorForm;

