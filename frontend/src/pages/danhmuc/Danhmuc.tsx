/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { categoriesApi } from "../../services/categories.service";
import DanhmucModal from "./DanhmucModal";

const Danhmuc: React.FC = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const { data: categories, isLoading, isError } = useQuery(
    ["fetchCategories"],
    categoriesApi.getAll
  );

  const deleteMutation = useMutation(
    (id: string) => categoriesApi.delete(id),
    {
      onSuccess: () => queryClient.invalidateQueries(["fetchCategories"]),
    }
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn chắc muốn xóa danh mục này?")) {
      deleteMutation.mutate(id);
    }
  };

  const openAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEdit = (category: any) => {
    setEditData(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (form: any) => {
    try {
      if (editData) {
        await categoriesApi.update(editData.category_id, form);
      } else {
        await categoriesApi.create(form);
      }

      setIsModalOpen(false);
      queryClient.invalidateQueries(["fetchCategories"]);
    } catch (e) {
      console.error(e);
    }
  };

  // ----------- VALIDATE TRƯỚC KHI RENDER TABLE --------------
  if (isLoading) return <span>Đang tải danh mục...</span>;

  if (!categories || !Array.isArray(categories))
    return (
      <div className="p-6 bg-gray-100 rounded-lg shadow flex justify-between">
        <div>
          <h2 className="text-xl font-semibold">Không có danh mục.</h2>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Thêm danh mục
        </button>
      </div>
    );
  // -----------------------------------------------------------

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách Danh mục</h1>

        <button
          type="button"
          onClick={openAdd}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + Thêm danh mục
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Tên danh mục</th>
              <th className="p-3 text-left">Mô tả</th>
              <th className="p-3 text-left">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c: any) => (
              <tr key={c.category_id} className="border-b">
                <td className="p-3 font-semibold">{c.name}</td>
                <td className="p-3">{c.description || "-"}</td>

                <td className="p-3 space-x-2">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Sửa
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(c.category_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DanhmucModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Danhmuc;
