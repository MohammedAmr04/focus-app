// import { PrismaPg } from '@prisma/adapter-pg';

// import { env } from '../../config/env.js';
// import { PrismaClient } from '../../generated/prisma/client.js';

// const adapter = new PrismaPg({
//   connectionString: env.DATABASE_URL,
//   max: env.NODE_ENV === 'production' ? 10 : 5,
//   connectionTimeoutMillis: 5_000,
//   idleTimeoutMillis: 30_000,
// });

// export const prisma = new PrismaClient({ adapter });

// export async function disconnectPrisma(): Promise<void> {
//   await prisma.$disconnect();
// }
