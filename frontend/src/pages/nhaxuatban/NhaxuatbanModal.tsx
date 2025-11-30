/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "react-hook-form";

type PublisherForm = {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any | null;
    onSubmit: (data: PublisherForm) => void;
};

const NhaxuatbanModal: React.FC<Props> = ({
    isOpen,
    onClose,
    initialData,
    onSubmit,
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<PublisherForm>();

    React.useEffect(() => {
        reset(initialData || { name: "", email: "", phone: "", address: "" });
    }, [initialData, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">

                <h2 className="text-2xl font-bold text-[#6B4F3A] mb-4 flex justify-between items-center">
                    {initialData ? "Chỉnh sửa Nhà xuất bản" : "Thêm Nhà xuất bản"}

                    <button type="button" onClick={onClose}>
                        ✕
                    </button>
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <label className="font-semibold text-sm">Tên NXB *</label>
                        <input
                            className="w-full p-2 border rounded-lg mt-1"
                            {...register("name", { required: "Tên NXB không được bỏ trống" })}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="font-semibold text-sm">Email</label>
                        <input className="w-full p-2 border rounded-lg mt-1" {...register("email")} />
                    </div>

                    <div>
                        <label className="font-semibold text-sm">Số điện thoại</label>
                        <input className="w-full p-2 border rounded-lg mt-1" {...register("phone")} />
                    </div>

                    <div>
                        <label className="font-semibold text-sm">Địa chỉ</label>
                        <input className="w-full p-2 border rounded-lg mt-1" {...register("address")} />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 rounded-lg"
                            onClick={onClose}
                        >
                            Hủy
                        </button>

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

export default NhaxuatbanModal;
