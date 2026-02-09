"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  BarChart3,
  Target,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "หน้าหลัก", icon: LayoutDashboard },
  { href: "/add", label: "เพิ่มรายการ", icon: PlusCircle },
  { href: "/history", label: "ประวัติ", icon: List },
  { href: "/summary", label: "สรุป", icon: BarChart3 },
  { href: "/budget", label: "งบประมาณ", icon: Target },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "h-screen bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col shadow-xl",
          // Desktop: always visible, collapsible
          "hidden lg:flex transition-all duration-300",
          collapsed ? "lg:w-18" : "lg:w-60",
          // Mobile: full drawer overlay
          isOpen &&
            "flex! fixed inset-y-0 left-0 z-50 w-64 animate-in slide-in-from-left duration-300"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/6">
          {(!collapsed || isOpen) && (
            <h1 className="text-lg font-bold bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              💰 บัญชีของฉัน
            </h1>
          )}
          {/* Desktop: collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/6 transition-colors hidden lg:block"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          {/* Mobile: close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/6 transition-colors lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/10 font-medium"
                        : "text-slate-400 hover:bg-white/6 hover:text-slate-200"
                    )}
                    title={collapsed && !isOpen ? item.label : undefined}
                  >
                    <item.icon size={20} className={isActive ? "text-emerald-400" : ""} />
                    {(!collapsed || isOpen) && <span className="text-sm">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/6">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 transition-all duration-200 w-full rounded-xl hover:bg-red-500/10"
            title={collapsed && !isOpen ? "ออกจากระบบ" : undefined}
          >
            <LogOut size={20} />
            {(!collapsed || isOpen) && <span className="text-sm">ออกจากระบบ</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
