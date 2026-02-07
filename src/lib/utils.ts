// ฟอร์แมตเงินบาท
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
}

// ฟอร์แมตวันที่แบบไทย
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ฟอร์แมตวันที่สั้น
export function formatShortDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("th-TH", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

// ประเภทบัญชีเป็นภาษาไทย
export function getAccountTypeName(type: string): string {
  const types: Record<string, string> = {
    asset: "สินทรัพย์",
    liability: "หนี้สิน",
    equity: "ส่วนของเจ้าของ",
    revenue: "รายได้",
    expense: "ค่าใช้จ่าย",
  };
  return types[type] || type;
}

// สถานะเป็นภาษาไทย
export function getStatusName(status: string): string {
  const statuses: Record<string, string> = {
    pending: "รอดำเนินการ",
    approved: "อนุมัติแล้ว",
    cancelled: "ยกเลิก",
  };
  return statuses[status] || status;
}

// สีของสถานะ
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// cn utility for className merging (simple version)
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
