import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface Book {
    book_id: string;
    title: string;
    price: number;
    description: string;
    cover_image: string;
}

interface Props {
    book: Book;
    favorites: Book[];
    toggleFavorite: (book: Book) => void;
    handleAddToCart: (book: Book) => void;
    handleViewDetail: (id: string) => void;
}

const BookCard: React.FC<Props> = ({
    book,
    favorites,
    toggleFavorite,
    handleAddToCart,
    handleViewDetail,
}) => {
    const isFav = favorites.some((f) => f.book_id === book.book_id);

    return (
        <div className="bg-white/10 border border-purple-700/30 backdrop-blur-lg rounded-xl p-4 shadow-xl hover:shadow-purple-500/30 transition">

            {/* IMAGE WRAPPER + HEART ICON */}
            <div className="relative w-full h-48 bg-gray-800 rounded-md overflow-hidden mb-4">

                <button
                    onClick={() => toggleFavorite(book)}
                    className="
                        absolute top-2 left-200 z-20
                        bg-white/80 backdrop-blur-sm p-2 rounded-full shadow
                        hover:scale-110 active:scale-95 transition
                    "
                >
                    {isFav ? (
                        <AiFillHeart className="text-red-500 text-2xl" />
                    ) : (
                        <AiOutlineHeart className="text-gray-700 text-2xl" />
                    )}
                </button>

                {/* IMAGE */}
                {book.cover_image ? (
                    <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="text-center text-gray-400 pt-16">
                        Không có ảnh
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <h3 className="text-xl font-semibold text-white">{book.title}</h3>

            <p className="text-purple-300 mt-1 font-bold">
                {book.price.toLocaleString()}đ
            </p>

            <p className="text-gray-300 text-sm line-clamp-2 mt-2">
                {book.description}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => handleAddToCart(book)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                >
                    Thêm
                </button>

                <button
                    onClick={() => handleViewDetail(book.book_id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                >
                    Chi tiết
                </button>
            </div>
        </div>
    );
};

export default BookCard;
