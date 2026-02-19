"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddDebtModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function AddDebtModal({ onClose, onSaved }: AddDebtModalProps) {
  const [type, setType] = useState<"borrow" | "lend">("borrow");
  const [amount, setAmount] = useState("");
  const [person, setPerson] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"unpaid" | "paid">("unpaid");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!amount || !person || !description) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount, person, description, date, note, status }),
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">เพิ่มหนี้ใหม่</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl transition-all duration-200">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200/60 rounded-xl px-4 py-3 text-rose-600 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-1 flex gap-1">
            <button type="button" onClick={() => setType("borrow")}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                type === "borrow" ? "bg-rose-500 text-white shadow-sm" : "text-gray-400 hover:text-gray-600")}
            >ฉันยืมเงิน</button>
            <button type="button" onClick={() => setType("lend")}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                type === "lend" ? "bg-blue-500 text-white shadow-sm" : "text-gray-400 hover:text-gray-600")}
            >ฉันให้ยืมเงิน</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">จำนวนเงิน (บาท)</label>
            <input type="number" inputMode="decimal" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
              className="w-full text-2xl font-bold text-gray-800 border border-gray-200/60 rounded-xl px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all tabular-nums" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">ชื่อคนที่เกี่ยวข้อง</label>
            <input type="text" value={person} onChange={e => setPerson(e.target.value)} placeholder="ชื่อเพื่อน/คนที่ยืม/ให้ยืม" className="w-full border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">รายละเอียด</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">วันที่</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">หมายเหตุ (ไม่บังคับ)</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="บันทึกเพิ่มเติม..." className="w-full border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200">ยกเลิก</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-md bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 shadow-emerald-200/50">
              <Save size={16} />
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
