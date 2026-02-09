"use client";

import { Bell, Search, User, LogOut, Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-14 sm:h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 gap-3">
      {/* Left side: hamburger + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Hamburger menu - mobile only */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 lg:hidden shrink-0"
          aria-label="เปิดเมนู"
        >
          <Menu size={22} className="text-gray-600" />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2.5 bg-gray-100/80 rounded-xl px-4 py-2.5 w-full max-w-xs lg:max-w-sm border border-gray-200/50 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="ค้นหารายการ..."
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile search button */}
        <button className="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 sm:hidden">
          <Search size={19} className="text-gray-500" />
        </button>

        <button className="relative p-2 sm:p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 group">
          <Bell size={19} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer hover:bg-gray-100/80 rounded-xl px-2 sm:px-3 py-1.5 transition-all duration-200"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-200">
              <User size={16} className="text-white" />
            </div>
            <div className="text-sm text-left hidden sm:block">
              <p className="font-semibold text-gray-700 leading-tight">
                {session?.user?.name || "ผู้ใช้"}
              </p>
              <p className="text-xs text-gray-400 leading-tight">
                {session?.user?.email || ""}
              </p>
            </div>
          </button>

          {/* Dropdown */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-14 w-52 bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 z-20 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {session?.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors rounded-lg mx-0"
                >
                  <LogOut size={15} />
                  ออกจากระบบ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
