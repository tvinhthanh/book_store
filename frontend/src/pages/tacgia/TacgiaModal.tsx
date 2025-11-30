/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type AuthorForm = {
    name: string;
    bio?: string | null;
    birth_date?: string | null;
    country?: string | null;
};

const AuthorModal = ({ isOpen, onClose, initialData, onSubmit }: any) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<AuthorForm>();

    useEffect(() => {
        if (isOpen) {
            reset(initialData ?? {
                name: "",
                bio: "",
                birth_date: null,
                country: "",
            });
        }
    }, [isOpen, reset, initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">

                <h2 className="text-2xl font-bold text-[#6B4F3A] mb-4 flex justify-between">
                    {initialData ? "Chỉnh sửa Tác giả" : "Thêm Tác giả"}
                    <button type="button" onClick={onClose}>✕</button>
                </h2>

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit((data) => {

                        const payload = {
                            name: data.name,
                            bio: data.bio || null,
                            country: data.country || null,
                            birth_date: data.birth_date || null,
                        };

                        onSubmit(payload);
                    })}
                >

                    <div>
                        <label className="font-semibold text-sm">Tên tác giả *</label>
                        <input
                            className="w-full p-2 border rounded-lg mt-1"
                            {...register("name", { required: "Tên tác giả không được bỏ trống" })}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="font-semibold text-sm">Quốc gia</label>
                        <input className="w-full p-2 border rounded-lg mt-1" {...register("country")} />
                    </div>

                    <div>
                        <label className="font-semibold text-sm">Ngày sinh</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded-lg mt-1"
                            {...register("birth_date")}
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-sm">Tiểu sử</label>
                        <textarea
                            className="w-full p-2 border rounded-lg mt-1 h-24"
                            {...register("bio")}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 rounded-lg"
                            onClick={onClose}
                        >Hủy</button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#6B4F3A] text-white rounded-lg"
                        >
                            {initialData ? "Lưu thay đổi" : "Thêm mới"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default AuthorModal;
