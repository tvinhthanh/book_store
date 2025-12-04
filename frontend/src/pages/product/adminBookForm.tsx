import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { booksApi } from "../../services/books.service";

const AdminBookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = !!id;

  const { register, handleSubmit, setValue } = useForm();

  useQuery(["admin-book", id], () => booksApi.getByID(id as string), {
    enabled: isEdit,
    onSuccess: (data) => {
      Object.keys(data).forEach((key) => {
        if (key !== "cover_image") {
          setValue(key, data[key]);
        }
      });
    },
  });

  const mutation = useMutation(
    (data: any) => {
      if (isEdit) return booksApi.update(id as string, data);
      return booksApi.create(data);
    },
    {
      onSuccess: () => {
        navigate("/admin/books");
      },
    }
  );

  const onSubmit = handleSubmit((data) => mutation.mutate(data));

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto"
    >
      <h2 className="font-bold mb-4">
        {isEdit ? "Cập nhật sách" : "Thêm sách"}
      </h2>

      <input
        placeholder="Tên sách"
        className="border p-2 w-full mb-3"
        {...register("title")}
      />

      <input
        placeholder="Giá"
        type="number"
        className="border p-2 w-full mb-3"
        {...register("price")}
      />

      <input
        type="file"
        className="border p-2 w-full mb-3"
        {...register("cover_image")}
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        {isEdit ? "Cập nhật" : "Thêm mới"}
      </button>
    </form>
  );
};

export default AdminBookForm;
