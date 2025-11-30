/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { authorsApi } from "../../services/authors.service";
import AuthorModal from "./TacgiaModal";

const AuthorsPage: React.FC = () => {
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // FETCH
    const { data: authors, isLoading, isError } = useQuery(
        ["fetchAuthors"],
        authorsApi.getAll
    );

    // DELETE
    const deleteMutation = useMutation(
        (id: string) => authorsApi.delete(id),
        {
            onSuccess: () => queryClient.invalidateQueries(["fetchAuthors"]),
        }
    );

    const handleDelete = (id: string) => {
        if (window.confirm("Bạn chắc muốn xóa?")) {
            deleteMutation.mutate(id);
        }
    };

    // ADD NEW
    const openAdd = () => {
        console.log("CLICK ADD AUTHOR"); // debug
        setEditData(null);
        setIsModalOpen(true);
    };

    // EDIT
    const openEdit = (author: any) => {
        setEditData(author);
        setIsModalOpen(true);
    };

    // SUBMIT
    const handleSubmit = async (data: any) => {
        try {
            if (editData) {
                await authorsApi.update(editData.author_id, data);
            } else {
                await authorsApi.create(data);
            }
            setIsModalOpen(false);
            queryClient.invalidateQueries(["fetchAuthors"]);
        } catch (error) {
            console.error("SAVE ERROR:", error);
        }
    };

    if (isLoading) return <span>Đang tải tác giả...</span>;

    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Danh sách Tác giả</h1>

                {/* ❗ MUST HAVE type="button" – CHỐNG SUBMIT FORM */}
                <button
                    type="button"
                    onClick={openAdd}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                    + Thêm Tác Giả
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Tên tác giả</th>
                            <th className="p-3 text-left">Quốc gia</th>
                            <th className="p-3 text-left">Năm sinh</th>
                            <th className="p-3 text-left">Tiểu sử</th>
                            <th className="p-3 text-left">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {authors?.map((a: any) => (
                            <tr key={a.author_id} className="border-b">
                                <td className="p-3">{a.name}</td>
                                <td className="p-3">{a.country || "-"}</td>

                                {/* HIỂN THỊ NGÀY SINH */}
                                <td className="p-3">
                                    {a.birth_date
                                        ? new Date(a.birth_date).toLocaleDateString("vi-VN")
                                        : "-"}
                                </td>

                                <td className="p-3 max-w-sm truncate">{a.bio || "-"}</td>

                                <td className="p-3 space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(a)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(a.author_id)}
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

            <AuthorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editData}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AuthorsPage;
