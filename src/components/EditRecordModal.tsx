"use client";

import { useState, useEffect } from "react";
import { X, Save, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const incomeCategories = [
  "เงินเดือน",
  "รายได้เสริม",
  "ค่าฟรีแลนซ์",
  "ดอกเบี้ย",
  "ปันผล",
  "ของขวัญ/เงินช่วย",
  "ขายของ",
  "อื่นๆ",
];

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

interface Record {
  id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  note: string | null;
}

interface EditRecordModalProps {
  record: Record;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditRecordModal({
  record,
  onClose,
  onSaved,
}: EditRecordModalProps) {
  const [type, setType] = useState<"income" | "expense">(
    record.type as "income" | "expense"
  );
  const [amount, setAmount] = useState(String(record.amount));
  const [category, setCategory] = useState(record.category);
  const [description, setDescription] = useState(record.description);
  const [date, setDate] = useState(record.date.split("T")[0]);
  const [note, setNote] = useState(record.note || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = type === "income" ? incomeCategories : expenseCategories;

  // Reset category if type changes and current category is not in the new list
  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory("");
    }
  }, [type, categories, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || !category || !description) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/records/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount, category, description, date, note }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      onSaved();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">
            แก้ไขรายการ
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200/60 rounded-xl px-4 py-3 text-rose-600 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Type Toggle */}
          <div className="bg-gray-50 rounded-xl p-1 flex gap-1">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                type === "expense"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <TrendingDown size={16} />
              รายจ่าย
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                type === "income"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <TrendingUp size={16} />
              รายรับ
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              จำนวนเงิน (บาท)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full text-2xl font-bold text-gray-800 border border-gray-200/60 rounded-xl px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all tabular-nums"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              หมวดหมู่
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs transition-all duration-200 font-medium",
                    category === cat
                      ? type === "income"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-rose-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200/60"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              รายละเอียด
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              วันที่
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              required
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              หมายเหตุ (ไม่บังคับ)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="บันทึกเพิ่มเติม..."
              className="w-full border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn(
                "flex-1 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-md",
                type === "income"
                  ? "bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 shadow-emerald-200/50"
                  : "bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 shadow-rose-200/50"
              )}
            >
              <Save size={16} />
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
