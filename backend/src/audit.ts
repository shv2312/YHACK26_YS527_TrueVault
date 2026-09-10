import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logEvent(action: string, details: any = {}) {
  try {
    // We stringify details to store them simply in the DB
    await prisma.auditEvent.create({
      data: {
        action,
        details: JSON.stringify(details),
      }
    });
    console.log(`[AUDIT] ${action}:`, details);
  } catch (error) {
    console.error(`[AUDIT ERROR] Failed to log event ${action}:`, error);
  }
}
