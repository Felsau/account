import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - ดึงงบประมาณทั้งหมด + ยอดใช้จ่ายจริงของเดือนปัจจุบัน
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
    orderBy: { category: "asc" },
  });

  // ดึงรายจ่ายเดือนนี้แยกตามหมวดหมู่
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const expenses = await prisma.record.findMany({
    where: {
      userId: session.user.id,
      type: "expense",
      date: { gte: startDate, lte: endDate },
    },
  });

  const spentByCategory: { [key: string]: number } = {};
  for (const expense of expenses) {
    spentByCategory[expense.category] =
      (spentByCategory[expense.category] || 0) + expense.amount;
  }

  const budgetWithSpent = budgets.map((b) => ({
    ...b,
    spent: spentByCategory[b.category] || 0,
    remaining: b.amount - (spentByCategory[b.category] || 0),
    percentage: b.amount > 0
      ? Math.min(
          ((spentByCategory[b.category] || 0) / b.amount) * 100,
          100
        )
      : 0,
    overBudget: (spentByCategory[b.category] || 0) > b.amount,
  }));

  // สรุป
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = Object.values(spentByCategory).reduce(
    (sum, v) => sum + v,
    0
  );

  return NextResponse.json({
    budgets: budgetWithSpent,
    summary: {
      totalBudget,
      totalSpent,
      totalRemaining: totalBudget - totalSpent,
      overallPercentage:
        totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0,
    },
  });
}

// POST - เพิ่ม/อัปเดตงบประมาณ
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { category, amount } = body;

  if (!category || amount === undefined || amount === null) {
    return NextResponse.json(
      { error: "กรุณากรอกข้อมูลให้ครบ" },
      { status: 400 }
    );
  }

  const budget = await prisma.budget.upsert({
    where: {
      userId_category: {
        userId: session.user.id,
        category,
      },
    },
    update: { amount: parseFloat(amount) },
    create: {
      category,
      amount: parseFloat(amount),
      userId: session.user.id,
    },
  });

  return NextResponse.json(budget);
}

// DELETE - ลบงบประมาณ
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ไม่ระบุ id" }, { status: 400 });
  }

  const budget = await prisma.budget.findUnique({ where: { id } });
  if (!budget || budget.userId !== session.user.id) {
    return NextResponse.json({ error: "ไม่พบงบประมาณ" }, { status: 404 });
  }

  await prisma.budget.delete({ where: { id } });
  return NextResponse.json({ message: "ลบงบประมาณแล้ว" });
}
