import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// DELETE - ลบรายการ
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const record = await prisma.record.findUnique({ where: { id } });
  if (!record || record.userId !== session.user.id) {
    return NextResponse.json({ error: "ไม่พบรายการ" }, { status: 404 });
  }

  await prisma.record.delete({ where: { id } });
  return NextResponse.json({ message: "ลบรายการแล้ว" });
}

// PUT - แก้ไขรายการ
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

  const record = await prisma.record.findUnique({ where: { id } });
  if (!record || record.userId !== session.user.id) {
    return NextResponse.json({ error: "ไม่พบรายการ" }, { status: 404 });
  }

  const updated = await prisma.record.update({
    where: { id },
    data: {
      type: body.type,
      amount: parseFloat(body.amount),
      category: body.category,
      description: body.description,
      date: new Date(body.date),
      note: body.note || null,
    },
  });

  return NextResponse.json(updated);
}
