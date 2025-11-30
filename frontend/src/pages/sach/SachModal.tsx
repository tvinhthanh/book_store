/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { categoriesApi } from "../../services/categories.service";
import { authorsApi } from "../../services/authors.service";
import { publishersApi } from "../../services/publishers.service";
import { useQuery } from "react-query";

type BookForm = {
    title: string;
    description?: string | null;
    price: number;
    stock_quantity: number;
    category_id: string;
    author_id: string;
    publisher_id: string;
    published_date?: string | null;
    language?: string | null;
    // cover_image?: string;
    cover_image?: File | null;
};

const BookModal = ({ isOpen, onClose, initialData, onSubmit }: any) => {

    const { register, handleSubmit, reset, setValue } =
        useForm<BookForm>();

    const [preview, setPreview] = useState<string | null>(null);

    // Dropdown data
    const { data: categories } = useQuery(["categories"], categoriesApi.getAll);
    const { data: authors } = useQuery(["authors"], authorsApi.getAll);
    const { data: publishers } = useQuery(["publishers"], publishersApi.getAll);

    // Reset form when open
    useEffect(() => {
        if (isOpen) {
            reset(
                initialData || {
                    title: "",
                    description: "",
                    price: 0,
                    stock_quantity: 0,
                    category_id: "",
                    author_id: "",
                    publisher_id: "",
                    published_date: "",
                    language: "",
                    cover_image: "",
                }
            );

            setPreview(initialData?.cover_image || null);
        }
    }, [isOpen, initialData, reset]);

    // Handle image upload preview
    const handleImageSelect = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setValue("cover_image", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl 
                    max-h-[85vh] overflow-hidden flex flex-col">

                {/* HEADER – cố định không scroll */}
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#6B4F3A]">
                        {initialData ? "Chỉnh sửa Sách" : "Thêm Sách"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-black text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* BODY – có scroll */}
                <div className="p-6 overflow-y-auto space-y-4">
                    <form
                        className="grid grid-cols-2 gap-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        {/* TITLE */}
                        <div className="col-span-2">
                            <label className="font-semibold text-sm">Tên sách *</label>
                            <input
                                {...register("title", { required: "Không được bỏ trống" })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>

                        {/* CATEGORY */}
                        <div>
                            <label className="font-semibold text-sm">Danh mục *</label>
                            <select {...register("category_id")} className="w-full p-2 border rounded-lg">
                                <option value="">-- Chọn --</option>
                                {categories?.map((c: any) => (
                                    <option key={c.category_id} value={c.category_id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* AUTHOR */}
                        <div>
                            <label className="font-semibold text-sm">Tác giả *</label>
                            <select {...register("author_id")} className="w-full p-2 border rounded-lg">
                                <option value="">-- Chọn --</option>
                                {authors?.map((a: any) => (
                                    <option key={a.author_id} value={a.author_id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* PUBLISHER */}
                        <div>
                            <label className="font-semibold text-sm">Nhà xuất bản *</label>
                            <select {...register("publisher_id")} className="w-full p-2 border rounded-lg">
                                <option value="">-- Chọn --</option>
                                {publishers?.map((p: any) => (
                                    <option key={p.publisher_id} value={p.publisher_id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* PRICE */}
                        <div>
                            <label className="font-semibold text-sm">Giá *</label>
                            <input type="number" {...register("price")} className="w-full p-2 border rounded-lg" />
                        </div>

                        {/* STOCK */}
                        <div>
                            <label className="font-semibold text-sm">Tồn kho *</label>
                            <input type="number" {...register("stock_quantity")} className="w-full p-2 border rounded-lg" />
                        </div>

                        {/* DATE */}
                        <div className="col-span-2">
                            <label className="font-semibold">Ngày xuất bản</label>
                            <input type="date" {...register("published_date")} className="w-full p-2 border rounded-lg" />
                        </div>

                        {/* LANGUAGE */}
                        <div className="col-span-2">
                            <label className="font-semibold">Ngôn ngữ</label>
                            <input type="text" {...register("language")} className="w-full p-2 border rounded-lg" />
                        </div>

                        {/* COVER IMAGE */}
                        <div className="col-span-2">
                            <label className="font-semibold text-sm">Ảnh bìa</label>
                            <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full p-2 border rounded-lg" />

                            {preview && (
                                <img
                                    src={preview}
                                    className="w-32 h-40 object-cover rounded mt-2 shadow"
                                />
                            )}
                        </div>

                        {/* DESCRIPTION */}
                        <div className="col-span-2">
                            <label className="font-semibold">Mô tả</label>
                            <textarea {...register("description")} className="w-full p-2 border rounded-lg h-24" />
                        </div>

                        {/* BUTTONS */}
                        <div className="col-span-2 flex justify-end gap-3 pt-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Hủy</button>
                            <button type="submit" className="px-4 py-2 bg-[#6B4F3A] text-white rounded-lg">
                                {initialData ? "Lưu thay đổi" : "Thêm mới"}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default BookModal;
