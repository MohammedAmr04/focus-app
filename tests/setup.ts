process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DATABASE_URL =
  'postgresql://focus_test:focus_test@127.0.0.1:5432/focus_test?schema=public';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.LOG_LEVEL = 'silent';
