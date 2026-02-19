"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import AddDebtModal from "@/components/AddDebtModal";

interface Debt {
  id: string;
  type: "borrow" | "lend";
  amount: number;
  person: string;
  description: string;
  date: string;
  note: string | null;
  status: "unpaid" | "paid";
}

const typeLabel = {
  borrow: "ฉันยืมเงิน",
  lend: "ฉันให้ยืมเงิน",
};

const statusLabel = {
  unpaid: "ยังไม่คืน",
  paid: "คืนแล้ว",
};


export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/debts");
      const data = await res.json();
      setDebts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">บันทึกหนี้</h1>
        <button
          className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all text-sm font-medium shadow-md"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={18} />
          เพิ่มหนี้
        </button>
            {showAdd && (
              <AddDebtModal
                onClose={() => setShowAdd(false)}
                onSaved={() => {
                  setShowAdd(false);
                  fetchData();
                }}
              />
            )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : debts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 font-medium">ยังไม่มีหนี้</div>
      ) : (
        <div className="space-y-3">
          {debts.map((debt) => (
            <div key={debt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", debt.type === "borrow" ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600")}>{typeLabel[debt.type]}</span>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", debt.status === "unpaid" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600")}>{statusLabel[debt.status]}</span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-lg font-bold text-gray-800 tabular-nums">{formatCurrency(debt.amount)}</span>
                  <span className="text-sm text-gray-500">{debt.person}</span>
                  <span className="text-sm text-gray-400">{debt.description}</span>
                  {debt.note && <span className="text-xs text-gray-400">({debt.note})</span>}
                </div>
                <div className="text-xs text-gray-400 mt-1">{new Date(debt.date).toLocaleDateString("th-TH")}</div>
              </div>
              <div className="flex gap-2 items-center">
                {debt.status === "unpaid" ? (
                  <button title="เปลี่ยนเป็นคืนแล้ว" className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                    <CheckCircle2 size={18} />
                  </button>
                ) : (
                  <button title="เปลี่ยนเป็นยังไม่คืน" className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-all">
                    <XCircle size={18} />
                  </button>
                )}
                <button title="แก้ไข" className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                  <Pencil size={16} />
                </button>
                <button title="ลบ" className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
