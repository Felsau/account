"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Pencil,
  Filter,
} from "lucide-react";
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

export default function HistoryPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/records?month=${selectedMonth}`;
      if (filter !== "all") url += `&type=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setRecords(data.records || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      year: "2-digit",
    });
  };

  // จัดกลุ่มตามวันที่
  const groupedByDate = records.reduce<{ [key: string]: Record[] }>(
    (groups, record) => {
      const dateKey = record.date.split("T")[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(record);
      return groups;
    },
    {}
  );

  const totalIncome = records
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">ประวัติรายการ</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-white border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
        />

        <div className="flex bg-white rounded-xl border border-gray-200/60 p-1 gap-0.5">
          {[
            { value: "all", label: "ทั้งหมด" },
            { value: "income", label: "รายรับ" },
            { value: "expense", label: "รายจ่าย" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as typeof filter)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm transition-all duration-200 font-medium",
                filter === item.value
                  ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-200/50"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap gap-3 sm:gap-5 text-xs sm:text-sm">
        <span className="text-emerald-600 font-semibold">
          รายรับ: +{formatCurrency(totalIncome)}
        </span>
        <span className="text-rose-600 font-semibold">
          รายจ่าย: -{formatCurrency(totalExpense)}
        </span>
        <span
          className={cn(
            "font-semibold",
            totalIncome - totalExpense >= 0 ? "text-blue-600" : "text-rose-600"
          )}
        >
          คงเหลือ: {formatCurrency(totalIncome - totalExpense)}
        </span>
      </div>

      {/* Records */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">กำลังโหลด...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
            <Filter size={24} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">ไม่พบรายการ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([dateKey, dayRecords]) => {
            const dayTotal = dayRecords.reduce(
              (sum, r) =>
                r.type === "income" ? sum + r.amount : sum - r.amount,
              0
            );
            return (
              <div
                key={dateKey}
                className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden"
              >
                {/* Date header */}
                <div className="px-4 sm:px-6 py-3 bg-gray-50/80 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    {formatDate(dateKey)}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      dayTotal >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {dayTotal >= 0 ? "+" : ""}
                    {formatCurrency(dayTotal)}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-50/80">
                  {dayRecords.map((record) => (
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
                            <ArrowUpRight
                              size={16}
                              className="text-emerald-500"
                            />
                          ) : (
                            <ArrowDownRight
                              size={16}
                              className="text-rose-500"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {record.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {record.category}
                            {record.note ? ` · ${record.note}` : ""}
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
              </div>
            );
          })}
        </div>
      )}

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
