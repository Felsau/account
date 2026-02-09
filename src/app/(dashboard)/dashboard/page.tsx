"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Trash2,
  Pencil,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import EditRecordModal from "@/components/EditRecordModal";

interface Record {
  id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  note: string | null;
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function DashboardPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);

  const fetchData = async () => {
    try {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const res = await fetch(`/api/records?month=${month}`);
      const data = await res.json();
      setRecords(data.records || []);
      setSummary(data.summary || { totalIncome: 0, totalExpense: 0, balance: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบรายการนี้หรือไม่?")) return;
    await fetch(`/api/records/${id}`, { method: "DELETE" });
    fetchData();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">สรุปเดือนนี้</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString("th-TH", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link
          href="/add"
          className="flex items-center gap-1.5 sm:gap-2 bg-linear-to-r from-emerald-500 to-teal-500 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 text-xs sm:text-sm font-medium shadow-md shadow-emerald-200/50 hover:shadow-lg hover:shadow-emerald-200/60 shrink-0"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">เพิ่มรายการ</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 tracking-wide">รายรับ</span>
            <div className="p-2.5 bg-linear-to-br from-emerald-400 to-green-500 rounded-xl shadow-sm shadow-emerald-200/50 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={18} className="text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 tracking-tight">
            +{formatCurrency(summary.totalIncome)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 hover:shadow-lg hover:shadow-rose-50 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 tracking-wide">รายจ่าย</span>
            <div className="p-2.5 bg-linear-to-br from-rose-400 to-red-500 rounded-xl shadow-sm shadow-rose-200/50 group-hover:scale-110 transition-transform duration-300">
              <TrendingDown size={18} className="text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 tracking-tight">
            -{formatCurrency(summary.totalExpense)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 tracking-wide">คงเหลือ</span>
            <div className="p-2.5 bg-linear-to-br from-blue-400 to-indigo-500 rounded-xl shadow-sm shadow-blue-200/50 group-hover:scale-110 transition-transform duration-300">
              <Wallet size={18} className="text-white" />
            </div>
          </div>
          <p
            className={cn(
              "text-2xl font-bold tracking-tight",
              summary.balance >= 0 ? "text-blue-600" : "text-rose-600"
            )}
          >
            {formatCurrency(summary.balance)}
          </p>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100/80 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 tracking-tight text-sm sm:text-base">รายการล่าสุด</h2>
          <Link
            href="/history"
            className="text-sm text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
          >
            ดูทั้งหมด →
          </Link>
        </div>

        {records.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
              <Wallet size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">ยังไม่มีรายการ</p>
            <Link
              href="/add"
              className="text-emerald-500 hover:text-emerald-600 text-sm mt-2 inline-block font-medium transition-colors"
            >
              เพิ่มรายการแรกของคุณ
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50/80">
            {records.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 hover:bg-gray-50/60 transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center",
                      record.type === "income"
                        ? "bg-emerald-50"
                        : "bg-rose-50"
                    )}
                  >
                    {record.type === "income" ? (
                      <ArrowUpRight size={16} className="text-emerald-500" />
                    ) : (
                      <ArrowDownRight size={16} className="text-rose-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {record.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {record.category} · {formatDate(record.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      record.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    )}
                  >
                    {record.type === "income" ? "+" : "-"}
                    {formatCurrency(record.amount)}
                  </span>
                  <button
                    onClick={() => setEditingRecord(record)}
                    className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="แก้ไข"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200"
                    title="ลบ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <EditRecordModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSaved={() => {
            setEditingRecord(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
