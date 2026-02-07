# 📊 ระบบบัญชี (Accounting System)

ระบบจัดการบัญชีออนไลน์ สร้างด้วย Next.js, TypeScript, Tailwind CSS และ Prisma

## ✨ ฟีเจอร์

- 📊 **แดชบอร์ด** - ภาพรวมข้อมูลทางการเงิน (รายได้, ค่าใช้จ่าย, กำไร)
- 📖 **ผังบัญชี** - จัดการผังบัญชี (สินทรัพย์, หนี้สิน, ส่วนของเจ้าของ, รายได้, ค่าใช้จ่าย)
- 💸 **บันทึกรายการ** - บันทึกรายการรับ-จ่ายและธุรกรรม
- 📒 **สมุดรายวัน** - บันทึกรายการในรูปแบบเดบิต-เครดิต
- 📈 **รายงาน** - งบกำไรขาดทุน, งบดุล
- ⚙️ **ตั้งค่า** - จัดการข้อมูลบริษัทและผู้ใช้

## 🛠 เทคโนโลยี

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite + Prisma ORM
- **Auth:** NextAuth.js
- **Charts:** Recharts
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

## 🚀 เริ่มต้นใช้งาน

```bash
# ติดตั้ง dependencies
npm install

# สร้างฐานข้อมูล
npx prisma migrate dev

# สร้าง Prisma Client
npx prisma generate

# รันเซิร์ฟเวอร์
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 📁 โครงสร้างโปรเจกต์

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/     # หน้าแดชบอร์ด
│   │   ├── accounts/      # หน้าผังบัญชี
│   │   ├── transactions/  # หน้าบันทึกรายการ
│   │   ├── journal/       # หน้าสมุดรายวัน
│   │   ├── reports/       # หน้ารายงาน
│   │   ├── settings/      # หน้าตั้งค่า
│   │   └── layout.tsx     # Layout หลัก (Sidebar + Header)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── StatCard.tsx
├── lib/
│   ├── prisma.ts          # Prisma Client
│   └── utils.ts           # Utility functions
└── generated/prisma/      # Prisma generated client
```
