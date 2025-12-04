import { AiOutlineBook } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface Category {
  category_id: string;
  name: string;
}

interface CategoryIconsProps {
  categories: Category[];
  maxItems?: number;
}

const CategoryIcons = ({ categories, maxItems = 8 }: CategoryIconsProps) => {
  const navigate = useNavigate();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-transparent py-6 border-b w-full">
      <div className="w-full px-4">
        <div className="flex items-center justify-between overflow-x-auto gap-4 pb-2 w-full">
          {categories.slice(0, maxItems).map((cat) => (
            <div
              key={cat.category_id}
              className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer hover:opacity-70 transition"
              onClick={() => navigate(`/the-loai/${cat.category_id}`)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                <AiOutlineBook className="text-2xl text-red-600" />
              </div>
              <span className="text-xs text-center text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;

