import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.admin.findMany();
  console.log("Admins Count:", admins.length);
  admins.forEach(admin => {
    console.log("ID:", admin.id, "Email:", admin.email, "Name:", admin.name);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
