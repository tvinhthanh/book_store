/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type CategoryForm = {
  name: string;
  description?: string | null;
};

const DanhmucModal = ({ isOpen, onClose, initialData, onSubmit }: any) => {
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CategoryForm>();

  useEffect(() => {
    if (isOpen) {
      reset(
        initialData || {
          name: "",
          description: "",
        }
      );
    }
  }, [isOpen, reset, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-[#6B4F3A] mb-4 flex justify-between items-center">
          {initialData ? "Chỉnh sửa danh mục" : "Thêm danh mục"}

          <button type="button" onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </h2>

        {/* FORM */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            const payload = {
              name: data.name,
              description: data.description || null,
            };
            onSubmit(payload);
          })}
        >
          <div>
            <label className="font-semibold text-sm">Tên danh mục *</label>
            <input
              {...register("name", { required: "Tên danh mục không được bỏ trống" })}
              className="w-full p-2 border rounded-lg mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="font-semibold text-sm">Mô tả</label>
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded-lg mt-1 h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#6B4F3A] text-white rounded-lg hover:bg-[#553726]"
            >
              {initialData ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DanhmucModal;
