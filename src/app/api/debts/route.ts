import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - ดึงหนี้ทั้งหมดของผู้ใช้
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const debts = await prisma.debt.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(debts);
}

// POST - เพิ่มหนี้ใหม่
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, amount, person, description, date, note, status } = body;

  if (!type || !amount || !person || !description || !date || !status) {
    return NextResponse.json(
      { error: "กรุณากรอกข้อมูลให้ครบ" },
      { status: 400 }
    );
  }

  const debt = await prisma.debt.create({
    data: {
      type,
      amount: parseFloat(amount),
      person,
      description,
      date: new Date(date),
      note: note || null,
      status,
      userId: session.user.id,
    },
  });

  return NextResponse.json(debt, { status: 201 });
}
