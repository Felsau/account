"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Filter,
} from "lucide-react";
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

export default function HistoryPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
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
        <h1 className="text-2xl font-bold text-gray-800">ประวัติรายการ</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />

        <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
          {[
            { value: "all", label: "ทั้งหมด" },
            { value: "income", label: "รายรับ" },
            { value: "expense", label: "รายจ่าย" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as typeof filter)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm transition-colors",
                filter === item.value
                  ? "bg-emerald-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex gap-4 text-sm">
        <span className="text-green-600 font-medium">
          รายรับ: +{formatCurrency(totalIncome)}
        </span>
        <span className="text-red-600 font-medium">
          รายจ่าย: -{formatCurrency(totalExpense)}
        </span>
        <span
          className={cn(
            "font-medium",
            totalIncome - totalExpense >= 0 ? "text-blue-600" : "text-red-600"
          )}
        >
          คงเหลือ: {formatCurrency(totalIncome - totalExpense)}
        </span>
      </div>

      {/* Records */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Filter size={40} className="mx-auto mb-2 text-gray-300" />
          <p>ไม่พบรายการ</p>
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
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Date header */}
                <div className="px-5 py-2.5 bg-gray-50 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    {formatDate(dateKey)}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      dayTotal >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {dayTotal >= 0 ? "+" : ""}
                    {formatCurrency(dayTotal)}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-50">
                  {dayRecords.map((record) => (
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
                            <ArrowUpRight
                              size={16}
                              className="text-green-600"
                            />
                          ) : (
                            <ArrowDownRight
                              size={16}
                              className="text-red-600"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {record.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            {record.category}
                            {record.note ? ` · ${record.note}` : ""}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
