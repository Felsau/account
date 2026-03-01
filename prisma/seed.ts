import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 เริ่มสร้างข้อมูลเริ่มต้น...");

  const seedPassword = process.env.SEED_PASSWORD;
  if (!seedPassword) {
    throw new Error("❌ กรุณาตั้งค่า SEED_PASSWORD ใน .env ก่อนรัน seed");
  }

  const hashedPassword = await bcrypt.hash(seedPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: "felsau@account.local" },
    update: {},
    create: {
      email: "felsau@account.local",
      name: "Felsau",
      password: hashedPassword,
    },
  });

  console.log(`✅ สร้างผู้ใช้: ${user.name} (${user.email})`);

  const sampleRecords = [
    { type: "income", amount: 25000, category: "เงินเดือน", description: "เงินเดือน ก.พ. 2569", date: new Date("2026-02-01") },
    { type: "expense", amount: 350, category: "อาหาร", description: "ข้าวกลางวัน", date: new Date("2026-02-02") },
    { type: "expense", amount: 1500, category: "เดินทาง", description: "เติมน้ำมัน", date: new Date("2026-02-03") },
    { type: "expense", amount: 89, category: "เครื่องดื่ม", description: "กาแฟ", date: new Date("2026-02-04") },
    { type: "income", amount: 3000, category: "รายได้เสริม", description: "ค่าฟรีแลนซ์", date: new Date("2026-02-05") },
    { type: "expense", amount: 8500, category: "ที่พัก", description: "ค่าหอพัก ก.พ.", date: new Date("2026-02-05") },
    { type: "expense", amount: 450, category: "อาหาร", description: "อาหารเย็น", date: new Date("2026-02-06") },
    { type: "expense", amount: 200, category: "ของใช้", description: "สบู่ แชมพู", date: new Date("2026-02-07") },
  ];

  for (const rec of sampleRecords) {
    await prisma.record.create({
      data: { ...rec, userId: user.id },
    });
  }

  console.log(`✅ สร้างรายการตัวอย่าง ${sampleRecords.length} รายการ`);
  console.log("🎉 สร้างข้อมูลเริ่มต้นเสร็จสิ้น!");
}

main()
  .catch((e) => {
    console.error("❌ เกิดข้อผิดพลาด:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
