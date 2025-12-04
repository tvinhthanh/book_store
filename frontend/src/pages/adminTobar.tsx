/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search } from "lucide-react";
import SignOutButton from "../components/SignOutButton";

interface Props {
  title: any;
}

export default function AdminTopbar({ title }: Props) {
  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-black">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 gap-2">
          <Search size={18} className="text-black" />
          <input
            type="text"
            placeholder="Tìm kiếm…"
            className="bg-transparent outline-none text-sm text-black placeholder:text-gray-500"
          />
        </div>

        {/* Avatar & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              alt="avatar"
              className="w-9 h-9 rounded-full border"
            />
          </div>
          <div className="border-l border-gray-200 pl-3">
            <div className="[&>button]:text-black [&>button]:hover:text-red-600 [&>button]:hover:bg-red-50 [&>button]:px-3 [&>button]:py-1.5 [&>button]:text-sm">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
