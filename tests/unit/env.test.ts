import { describe, expect, it } from 'vitest';

import { ConfigurationError, loadEnv } from '../../src/config/env.js';

const baseEnv = {
  DATABASE_URL: 'postgresql://focus:focus@localhost:5432/focus_test?schema=public',
  CORS_ORIGIN: 'http://localhost:5173',
};

describe('loadEnv', () => {
  it('applies safe defaults for optional values', () => {
    const parsed = loadEnv(baseEnv);

    expect(parsed.NODE_ENV).toBe('development');
    expect(parsed.PORT).toBe(3000);
    expect(parsed.LOG_LEVEL).toBe('info');
    expect(parsed.CORS_ORIGIN).toEqual(['http://localhost:5173']);
  });

  it('parses and normalizes a comma-separated CORS origin list', () => {
    const parsed = loadEnv({
      ...baseEnv,
      CORS_ORIGIN: ' http://localhost:5173/, https://app.example.com ',
    });

    expect(parsed.CORS_ORIGIN).toEqual(['http://localhost:5173', 'https://app.example.com']);
  });

  it('rejects missing required values without leaking their contents', () => {
    const withoutDatabaseUrl: NodeJS.ProcessEnv = { ...baseEnv };
    delete withoutDatabaseUrl.DATABASE_URL;

    expect(() => loadEnv(withoutDatabaseUrl)).toThrow(ConfigurationError);
    expect(() => loadEnv(withoutDatabaseUrl)).toThrow(/DATABASE_URL/);
  });

  it('rejects wildcard and path-based CORS origins', () => {
    expect(() => loadEnv({ ...baseEnv, CORS_ORIGIN: '*' })).toThrow(/explicit origins/);
    expect(() => loadEnv({ ...baseEnv, CORS_ORIGIN: 'https://app.example.com/api' })).toThrow(
      /must be origins/,
    );
  });

  it('rejects invalid ports and database URLs', () => {
    expect(() => loadEnv({ ...baseEnv, PORT: '0' })).toThrow(/PORT/);
    expect(() => loadEnv({ ...baseEnv, DATABASE_URL: 'https://example.com/database' })).toThrow(
      /PostgreSQL/,
    );
  });
});
