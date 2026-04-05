const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@rupeequick.com" },
    update: { password: hashedPassword },
    create: {
      email: "admin@rupeequick.com",
      password: hashedPassword,
      name: "Admin"
    },
  });
  console.log("Admin password reset successfully:", admin.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
