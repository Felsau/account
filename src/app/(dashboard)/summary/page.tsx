"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

interface MonthlyData {
  month: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
}

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = [
  "#10b981",
  "#f43f5e",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
  "#06b6d4",
  "#ef4444",
  "#a855f7",
];

export default function SummaryPage() {
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [expenseByCategory, setExpenseByCategory] = useState<CategoryData[]>([]);
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/summary?months=${months}`);
        const data = await res.json();
        setMonthly(data.monthly || []);
        setExpenseByCategory(data.expenseByCategory || []);
        setIncomeByCategory(data.incomeByCategory || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [months]);

  const totalIncome = monthly.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = monthly.reduce((sum, m) => sum + m.expense, 0);
  const avgMonthlyExpense = monthly.length > 0 ? totalExpense / monthly.length : 0;

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: ฿{formatTooltipValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { percent: number } }>;
  }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-700">{entry.name}</p>
          <p className="text-sm text-gray-600">฿{formatTooltipValue(entry.value)}</p>
          <p className="text-xs text-gray-400">
            {(entry.payload.percent * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            สรุปภาพรวม
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            วิเคราะห์รายรับ-รายจ่ายย้อนหลัง
          </p>
        </div>
        <div className="flex bg-white rounded-xl border border-gray-200/60 p-1 gap-0.5 self-start sm:self-auto">
          {[
            { value: 3, label: "3 เดือน" },
            { value: 6, label: "6 เดือน" },
            { value: 12, label: "12 เดือน" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setMonths(item.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-all duration-200 font-medium",
                months === item.value
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-sm font-medium text-gray-500">
              รายรับรวม ({months} เดือน)
            </span>
          </div>
          <p className="text-xl font-bold text-emerald-600 tracking-tight tabular-nums">
            +{formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-rose-500" />
            <span className="text-sm font-medium text-gray-500">
              รายจ่ายรวม ({months} เดือน)
            </span>
          </div>
          <p className="text-xl font-bold text-rose-600 tracking-tight tabular-nums">
            -{formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-500">
              จ่ายเฉลี่ย/เดือน
            </span>
          </div>
          <p className="text-xl font-bold text-blue-600 tracking-tight tabular-nums">
            {formatCurrency(avgMonthlyExpense)}
          </p>
        </div>
      </div>

      {/* Bar Chart - รายรับ vs รายจ่าย */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-6">
        <h2 className="font-semibold text-gray-800 mb-4 tracking-tight text-sm sm:text-base">
          รายรับ vs รายจ่ายรายเดือน
        </h2>
        {monthly.length === 0 ? (
          <div className="text-center py-12 text-gray-400">ไม่มีข้อมูล</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthly} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="income"
                name="รายรับ"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="รายจ่าย"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Line Chart - เทรนด์ยอดคงเหลือ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-6">
        <h2 className="font-semibold text-gray-800 mb-4 tracking-tight text-sm sm:text-base">
          เทรนด์ยอดคงเหลือ
        </h2>
        {monthly.length === 0 ? (
          <div className="text-center py-12 text-gray-400">ไม่มีข้อมูล</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="balance"
                name="คงเหลือ"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-6">
          <h2 className="font-semibold text-gray-800 mb-4 tracking-tight text-sm sm:text-base">
            สัดส่วนรายจ่าย (เดือนนี้)
          </h2>
          {expenseByCategory.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              ไม่มีรายจ่ายเดือนนี้
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {expenseByCategory.slice(0, 5).map((cat, i) => {
                  const total = expenseByCategory.reduce(
                    (s, c) => s + c.value,
                    0
                  );
                  const pct = total > 0 ? (cat.value / total) * 100 : 0;
                  return (
                    <div key={cat.name} className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: COLORS[i % COLORS.length],
                        }}
                      />
                      <span className="text-sm text-gray-600 flex-1 truncate">
                        {cat.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-700 tabular-nums">
                        {formatCurrency(cat.value)}
                      </span>
                      <span className="text-xs text-gray-400 w-10 text-right tabular-nums">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Income by Category */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-6">
          <h2 className="font-semibold text-gray-800 mb-4 tracking-tight text-sm sm:text-base">
            สัดส่วนรายรับ (เดือนนี้)
          </h2>
          {incomeByCategory.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              ไม่มีรายรับเดือนนี้
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={incomeByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {incomeByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {incomeByCategory.slice(0, 5).map((cat, i) => {
                  const total = incomeByCategory.reduce(
                    (s, c) => s + c.value,
                    0
                  );
                  const pct = total > 0 ? (cat.value / total) * 100 : 0;
                  return (
                    <div key={cat.name} className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: COLORS[i % COLORS.length],
                        }}
                      />
                      <span className="text-sm text-gray-600 flex-1 truncate">
                        {cat.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-700 tabular-nums">
                        {formatCurrency(cat.value)}
                      </span>
                      <span className="text-xs text-gray-400 w-10 text-right tabular-nums">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
