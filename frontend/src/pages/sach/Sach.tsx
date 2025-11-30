/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { booksApi } from "../../services/books.service";
import BookModal from "./SachModal";

const BooksPage: React.FC = () => {
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // FETCH
    const { data: books = [], isLoading } = useQuery(["fetchBooks"], booksApi.getAll);

    // DELETE
    const deleteMutation = useMutation((id: string) => booksApi.delete(id), {
        onSuccess: () => queryClient.invalidateQueries(["fetchBooks"])
    });

    const handleDelete = (id: string) => {
        if (confirm("Bạn chắc muốn xóa sách này?")) {
            deleteMutation.mutate(id);
        }
    };

    // ADD
    const openAdd = () => {
        setEditData(null);
        setIsModalOpen(true);
    };

    // EDIT
    const openEdit = (book: any) => {
        setEditData(book);
        setIsModalOpen(true);
    };

    // SUBMIT
    const handleSubmit = async (data: any) => {
        try {
            if (editData) {
                await booksApi.update(editData.book_id, data);
            } else {
                await booksApi.create(data);
            }

            setIsModalOpen(false);
            queryClient.invalidateQueries(["fetchBooks"]);
        } catch (e) {
            console.error("SAVE ERROR:", e);
        }
    };

    // Tính tổng
    const totalBooks = books.length;
    const totalValue = books.reduce(
        (sum: number, b: any) => sum + (b.price || 0) * (b.stock_quantity || 0),
        0
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Danh sách Sách</h1>

                    <button
                        onClick={openAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                    >
                        + Thêm sách
                    </button>
                </div>

                {/* STATS */}
                <div className="bg-white shadow rounded-lg p-4 flex justify-between">
                    <div className="font-medium text-gray-700">
                        Tổng số sách: <strong>{totalBooks}</strong>
                    </div>
                    <div className="font-medium text-gray-700">
                        Tổng giá trị kho:{" "}
                        <strong className="text-green-600">
                            {totalValue.toLocaleString()}₫
                        </strong>
                    </div>
                </div>

                {/* LOADING */}
                {isLoading ? (
                    <div className="text-center py-20 text-gray-600 text-lg">
                        Đang tải sách...
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-3 border">Ảnh</th>
                                    <th className="p-3 border text-left">Tiêu đề</th>
                                    <th className="p-3 border">Giá</th>
                                    <th className="p-3 border">Tồn kho</th>
                                    <th className="p-3 border">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book: any) => (
                                    <tr
                                        key={book.book_id}
                                        className="hover:bg-gray-100 transition"
                                    >
                                        <td className="p-3 border text-center">
                                            <img
                                                src={book.cover_image || "/no-image.jpg"}
                                                alt=""
                                                className="w-14 h-20 object-cover rounded shadow"
                                            />
                                        </td>

                                        <td className="p-3 border font-medium">{book.title}</td>

                                        <td className="p-3 border text-center">
                                            {book.price?.toLocaleString()}₫
                                        </td>

                                        <td className="p-3 border text-center">
                                            {book.stock_quantity}
                                        </td>

                                        <td className="p-3 border text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEdit(book)}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                                >
                                                    Sửa
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(book.book_id)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {books.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-gray-500">
                                            Không có sách nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* MODAL */}
                <BookModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={editData}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default BooksPage;
