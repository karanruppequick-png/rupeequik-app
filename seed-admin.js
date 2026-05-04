require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin@rupeequik123", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@rupeequik.com" },
    update: { password },
    create: {
      email: "admin@rupeequik.com",
      password,
      name: "Super Admin",
    },
  });
  console.log("Admin created/updated:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());