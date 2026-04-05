const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.findFirst();
  console.log("Admin found:", admin);
  process.exit(0);
}

main();
