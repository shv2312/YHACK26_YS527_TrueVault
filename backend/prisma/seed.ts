import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('demo_password_123', 10);

  const roles = ['ADMIN', 'OWNER', 'OFFICIAL', 'VERIFIER'];

  for (const role of roles) {
    const username = `demo_${role.toLowerCase()}`;
    await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        passwordHash,
        role: role as any,
      },
    });
    console.log(`Created demo user: ${username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
