/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search } from "lucide-react";

interface Props {
  title: any;
}

export default function AdminTopbar({ title }: Props) {
  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 gap-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm…"
            className="bg-transparent outline-none text-sm"
          />
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://ui-avatars.com/api/?name=Admin"
            alt="avatar"
            className="w-9 h-9 rounded-full border"
          />
        </div>
      </div>
    </header>
  );
}
