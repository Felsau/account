import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - ดึงข้อมูลสรุปรายเดือน (ย้อนหลัง 12 เดือน) + สัดส่วนหมวดหมู่
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const months = parseInt(searchParams.get("months") || "6");

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const records = await prisma.record.findMany({
    where: {
      userId: session.user.id,
      date: { gte: startDate },
    },
    orderBy: { date: "asc" },
  });

  // สรุปรายเดือน
  const monthlyMap: {
    [key: string]: { income: number; expense: number };
  } = {};

  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = { income: 0, expense: 0 };
  }

  // สัดส่วนหมวดหมู่ (เฉพาะเดือนปัจจุบัน)
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const categoryExpense: { [key: string]: number } = {};
  const categoryIncome: { [key: string]: number } = {};

  for (const record of records) {
    const d = new Date(record.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (monthlyMap[key]) {
      if (record.type === "income") {
        monthlyMap[key].income += record.amount;
      } else {
        monthlyMap[key].expense += record.amount;
      }
    }

    // สัดส่วนหมวดหมู่ เดือนปัจจุบัน
    if (key === currentMonthKey) {
      if (record.type === "expense") {
        categoryExpense[record.category] =
          (categoryExpense[record.category] || 0) + record.amount;
      } else {
        categoryIncome[record.category] =
          (categoryIncome[record.category] || 0) + record.amount;
      }
    }
  }

  const monthly = Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    label: new Date(month + "-01").toLocaleDateString("th-TH", {
      month: "short",
    }),
    ...data,
    balance: data.income - data.expense,
  }));

  const expenseByCategory = Object.entries(categoryExpense)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const incomeByCategory = Object.entries(categoryIncome)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return NextResponse.json({
    monthly,
    expenseByCategory,
    incomeByCategory,
  });
}
