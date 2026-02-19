import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - ดึงรายการทั้งหมด
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // format: 2026-02
  const type = searchParams.get("type"); // income | expense

  const where: Record<string, unknown> = { userId: session.user.id };

  if (type && (type === "income" || type === "expense")) {
    where.type = type;
  }

  if (month) {
    const [year, m] = month.split("-").map(Number);
    const startDate = new Date(year, m - 1, 1);
    const endDate = new Date(year, m, 0, 23, 59, 59);
    where.date = { gte: startDate, lte: endDate };
  }

  const records = await prisma.record.findMany({
    where,
    orderBy: { date: "desc" },
  });

  // คำนวณสรุป
  const allRecords = await prisma.record.findMany({
    where: month
      ? { userId: session.user.id, date: where.date as object }
      : { userId: session.user.id },
  });

  const totalIncome = allRecords
    .filter((r: any) => r.type === "income")
    .reduce((sum: number, r: any) => sum + r.amount, 0);
  const totalExpense = allRecords
    .filter((r: any) => r.type === "expense")
    .reduce((sum: number, r: any) => sum + r.amount, 0);

  return NextResponse.json({
    records,
    summary: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    },
  });
}

// POST - เพิ่มรายการใหม่
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, amount, category, description, date, note } = body;

  if (!type || !amount || !category || !description || !date) {
    return NextResponse.json(
      { error: "กรุณากรอกข้อมูลให้ครบ" },
      { status: 400 }
    );
  }

  const record = await prisma.record.create({
    data: {
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date),
      note: note || null,
      userId: session.user.id,
    },
  });

  return NextResponse.json(record, { status: 201 });
}
