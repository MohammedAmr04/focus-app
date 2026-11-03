import { loadEnvFile } from 'node:process';

import { defineConfig } from 'prisma/config';

function isMissingFileError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'ENOENT'
  );
}

try {
  loadEnvFile();
} catch (error) {
  if (!isMissingFileError(error)) {
    throw error;
  }
}

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  ...(databaseUrl === undefined
    ? {}
    : {
        datasource: {
          url: databaseUrl,
        },
      }),
});
