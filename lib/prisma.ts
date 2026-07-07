// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const connectionString = process.env.DATABASE_URL;

// const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({ adapter: new PrismaPg({ connectionString: connectionString! }) });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// } TODO LIMPIAR

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; pool?: Pool };

const pool =
  globalForPrisma.pool ??
  new Pool({ connectionString });

if (process.env.NODE_ENV !== "production") {
  pool.on("connect", () => {
    console.log(`[pg pool] nueva conexión física abierta. Total ahora: ${pool.totalCount}, idle: ${pool.idleCount}`);
  });
  pool.on("remove", () => {
    console.log(`[pg pool] conexión removida/cerrada. Total ahora: ${pool.totalCount}`);
  });
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaPg(pool) });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}