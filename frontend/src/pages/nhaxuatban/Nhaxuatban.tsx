/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { publishersApi } from "../../services/publishers.service";
import NhaxuatbanModal from "./NhaxuatbanModal";

const PublishersPage: React.FC = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // FETCH LIST
    const { data: publishers, isLoading, isError } = useQuery(
        ["fetchPublishers"],
        publishersApi.getAll
    );

    // DELETE
    const deleteMutation = useMutation(
        (id: string) => publishersApi.delete(id),
        {
            onSuccess: () => queryClient.invalidateQueries(["fetchPublishers"]),
        }
    );

    const handleDelete = (id: string) => {
        if (window.confirm("Bạn chắc muốn xóa?")) {
            deleteMutation.mutate(id);
        }
    };

    // OPEN ADD
    const openAdd = () => {
        console.log("OPEN ADD CLICKED");
        setEditData(null);
        setIsModalOpen(true);
    };

    // OPEN EDIT
    const openEdit = (publisher: any) => {
        console.log("OPEN EDIT CLICKED", publisher);
        setEditData(publisher);
        setIsModalOpen(true);
    };

    // SUBMIT
    const handleSubmit = async (form: any) => {
        try {
            if (editData) {
                await publishersApi.update(editData.publisher_id, form);
            } else {
                await publishersApi.create(form);
            }

            setIsModalOpen(false);
            queryClient.invalidateQueries(["fetchPublishers"]);
        } catch (e) {
            console.error(e);
        }
    };

    if (isLoading) return <span>Đang tải danh sách...</span>;

    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Danh sách Nhà xuất bản</h1>

                {/* BUTTON MUST HAVE type="button" */}
                <button
                    type="button"
                    onClick={openAdd}
                    className="bg-black text-white px-4 py-2 rounded-lg"
                >
                    + Thêm Nhà xuất bản
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Tên</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Điện thoại</th>
                            <th className="p-3 text-left">Địa chỉ</th>
                            <th className="p-3 text-left">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {publishers?.map((pub: any) => (
                            <tr key={pub.publisher_id} className="border-b">
                                <td className="p-3">{pub.name}</td>
                                <td className="p-3">{pub.email || "-"}</td>
                                <td className="p-3">{pub.phone || "-"}</td>
                                <td className="p-3">{pub.address || "-"}</td>

                                <td className="p-3 space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(pub)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(pub.publisher_id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Xóa
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate(`/books/publisher/${pub.publisher_id}`)}
                                        className="bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        Xem sách
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <NhaxuatbanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editData}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default PublishersPage;
