"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";

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
        <div className="text-gray-400">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">สรุปเดือนนี้</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("th-TH", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link
          href="/add"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
        >
          <Plus size={18} />
          เพิ่มรายการ
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">รายรับ</span>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp size={18} className="text-green-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-green-600">
            +{formatCurrency(summary.totalIncome)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">รายจ่าย</span>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown size={18} className="text-red-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-red-600">
            -{formatCurrency(summary.totalExpense)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">คงเหลือ</span>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet size={18} className="text-blue-600" />
            </div>
          </div>
          <p
            className={cn(
              "text-xl font-bold",
              summary.balance >= 0 ? "text-blue-600" : "text-red-600"
            )}
          >
            {formatCurrency(summary.balance)}
          </p>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">รายการล่าสุด</h2>
          <Link
            href="/history"
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            ดูทั้งหมด →
          </Link>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>ยังไม่มีรายการ</p>
            <Link
              href="/add"
              className="text-emerald-600 hover:underline text-sm mt-1 inline-block"
            >
              เพิ่มรายการแรกของคุณ
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {records.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      record.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    )}
                  >
                    {record.type === "income" ? (
                      <ArrowUpRight size={16} className="text-green-600" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {record.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {record.category} · {formatDate(record.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      record.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {record.type === "income" ? "+" : "-"}
                    {formatCurrency(record.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
