"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Target,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

const expenseCategories = [
  "อาหาร",
  "เครื่องดื่ม",
  "เดินทาง",
  "ที่พัก",
  "ค่าน้ำ/ค่าไฟ",
  "โทรศัพท์/เน็ต",
  "ของใช้",
  "เสื้อผ้า",
  "สุขภาพ",
  "บันเทิง",
  "การศึกษา",
  "ออม/ลงทุน",
  "อื่นๆ",
];

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  overBudget: boolean;
}

interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [summary, setSummary] = useState<BudgetSummary>({
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overallPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/budgets");
      const data = await res.json();
      setBudgets(data.budgets || []);
      setSummary(
        data.summary || {
          totalBudget: 0,
          totalSpent: 0,
          totalRemaining: 0,
          overallPercentage: 0,
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const existingCategories = budgets.map((b) => b.category);
  const availableCategories = expenseCategories.filter(
    (c) => !existingCategories.includes(c)
  );

  const handleAdd = async () => {
    if (!newCategory || !newAmount) return;
    setSaving(true);
    try {
      await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory, amount: newAmount }),
      });
      setNewCategory("");
      setNewAmount("");
      setShowAdd(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบงบประมาณนี้หรือไม่?")) return;
    await fetch(`/api/budgets?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const getProgressColor = (percentage: number, overBudget: boolean) => {
    if (overBudget) return "bg-rose-500";
    if (percentage >= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getProgressBg = (percentage: number, overBudget: boolean) => {
    if (overBudget) return "bg-rose-100";
    if (percentage >= 80) return "bg-amber-100";
    return "bg-emerald-100";
  };

  const now = new Date();
  const currentMonthLabel = now.toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            งบประมาณ
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{currentMonthLabel}</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-emerald-600 transition-all duration-200 text-xs sm:text-sm font-medium shadow-md shadow-emerald-200/50 shrink-0"
        >
          <Plus size={18} />
          ตั้งงบ
        </button>
      </div>

      {/* Add Budget Form */}
      {showAdd && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6 space-y-4">
          <h3 className="font-semibold text-gray-700">ตั้งงบประมาณใหม่</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
            >
              <option value="">เลือกหมวดหมู่</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="จำนวนเงิน (บาท/เดือน)"
              className="flex-1 border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={saving || !newCategory || !newAmount}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:bg-emerald-300 transition-all duration-200 shadow-sm"
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button
                onClick={() => {
                  setShowAdd(false);
                  setNewCategory("");
                  setNewAmount("");
                }}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-200"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Summary */}
      {budgets.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-blue-500" />
              <span className="font-semibold text-gray-700">ภาพรวม</span>
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                summary.totalSpent > summary.totalBudget
                  ? "text-rose-600"
                  : "text-emerald-600"
              )}
            >
              ใช้ไป {summary.overallPercentage.toFixed(0)}%
            </span>
          </div>

          {/* Overall progress bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                summary.totalSpent > summary.totalBudget
                  ? "bg-rose-500"
                  : summary.overallPercentage >= 80
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              )}
              style={{
                width: `${Math.min(
                  (summary.totalSpent / Math.max(summary.totalBudget, 1)) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              ใช้ไป{" "}
              <span className="font-semibold text-gray-700 tabular-nums">
                {formatCurrency(summary.totalSpent)}
              </span>
            </span>
            <span className="text-gray-500">
              จาก{" "}
              <span className="font-semibold text-gray-700 tabular-nums">
                {formatCurrency(summary.totalBudget)}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Budget Items */}
      {budgets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
            <Target size={24} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">ยังไม่ได้ตั้งงบประมาณ</p>
          <p className="text-gray-400 text-sm mt-1">
            กดปุ่ม &quot;ตั้งงบ&quot; เพื่อเริ่มต้น
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {budget.overBudget ? (
                    <AlertTriangle
                      size={16}
                      className="text-rose-500 shrink-0"
                    />
                  ) : budget.percentage >= 80 ? (
                    <AlertTriangle
                      size={16}
                      className="text-amber-500 shrink-0"
                    />
                  ) : (
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500 shrink-0"
                    />
                  )}
                  <span className="font-medium text-gray-700">
                    {budget.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      budget.overBudget
                        ? "text-rose-600"
                        : budget.percentage >= 80
                          ? "text-amber-600"
                          : "text-emerald-600"
                    )}
                  >
                    {budget.percentage.toFixed(0)}%
                  </span>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200"
                    title="ลบ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div
                className={cn(
                  "w-full h-2.5 rounded-full overflow-hidden mb-2",
                  getProgressBg(budget.percentage, budget.overBudget)
                )}
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    getProgressColor(budget.percentage, budget.overBudget)
                  )}
                  style={{
                    width: `${Math.min(
                      (budget.spent / Math.max(budget.amount, 1)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  ใช้ไป{" "}
                  <span className="font-medium tabular-nums">
                    {formatCurrency(budget.spent)}
                  </span>
                </span>
                <span className="text-gray-500">
                  งบ{" "}
                  <span className="font-medium tabular-nums">
                    {formatCurrency(budget.amount)}
                  </span>
                </span>
              </div>
              {budget.overBudget && (
                <p className="text-xs text-rose-500 mt-1.5 font-medium">
                  ⚠️ เกินงบ{" "}
                  {formatCurrency(budget.spent - budget.amount)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
