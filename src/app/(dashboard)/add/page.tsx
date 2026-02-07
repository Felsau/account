"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
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

export default function AddRecordPage() {
  const router = useRouter();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = type === "income" ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || !category || !description) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount, category, description, date, note }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">เพิ่มรายการ</h1>
      </div>

      {/* Type Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex">
        <button
          type="button"
          onClick={() => {
            setType("expense");
            setCategory("");
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors",
            type === "expense"
              ? "bg-red-500 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <TrendingDown size={18} />
          รายจ่าย
        </button>
        <button
          type="button"
          onClick={() => {
            setType("income");
            setCategory("");
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors",
            type === "income"
              ? "bg-green-500 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <TrendingUp size={18} />
          รายรับ
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Amount */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            จำนวนเงิน (บาท)
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full text-3xl font-bold text-gray-800 outline-none placeholder-gray-300"
            required
          />
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <label className="block text-sm font-medium text-gray-600 mb-3">
            หมวดหมู่
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-colors",
                  category === cat
                    ? type === "income"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description & Date */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              รายละเอียด
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เช่น ข้าวผัดกระเพรา, ค่ารถไฟฟ้า..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              วันที่
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              หมายเหตุ (ไม่บังคับ)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="บันทึกเพิ่มเติม..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className={cn(
            "w-full py-3 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-2",
            type === "income"
              ? "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
              : "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
          )}
        >
          <Save size={18} />
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>
    </div>
  );
}
