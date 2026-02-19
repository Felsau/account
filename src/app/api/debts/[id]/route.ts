import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PUT - อัปเดตหนี้
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const debt = await prisma.debt.findUnique({ where: { id } });
  if (!debt || debt.userId !== session.user.id) {
    return NextResponse.json({ error: "ไม่พบหนี้" }, { status: 404 });
  }

  const updated = await prisma.debt.update({
    where: { id },
    data: {
      type: body.type,
      amount: parseFloat(body.amount),
      person: body.person,
      description: body.description,
      date: new Date(body.date),
      note: body.note || null,
      status: body.status,
    },
  });

  return NextResponse.json(updated);
}

// DELETE - ลบหนี้
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const debt = await prisma.debt.findUnique({ where: { id } });
  if (!debt || debt.userId !== session.user.id) {
    return NextResponse.json({ error: "ไม่พบหนี้" }, { status: 404 });
  }

  await prisma.debt.delete({ where: { id } });
  return NextResponse.json({ message: "ลบหนี้แล้ว" });
}
