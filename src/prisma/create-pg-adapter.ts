import { PrismaPg } from '@prisma/adapter-pg';

export function createPgAdapter(databaseUrl: string, ssl: boolean) {
  const rest = ssl ? { ssl: { rejectUnauthorized: false } } : {};
  return new PrismaPg({
    connectionString: databaseUrl,
    ...rest,
  });
}
