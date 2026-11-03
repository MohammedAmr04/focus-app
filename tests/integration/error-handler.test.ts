import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createApp } from '../../src/app.js';
import { AppError } from '../../src/common/errors/app-error.js';
import { errorHandler } from '../../src/common/errors/error-handler.js';
import { requestId } from '../../src/common/middleware/request-id.js';

function createErrorTestApp() {
  const app = express();

  app.use(requestId);

  app.get('/expected-error', () => {
    throw new AppError(400, 'BAD_REQUEST', 'The request is invalid');
  });

  app.get('/unexpected-error', async () => {
    await Promise.resolve();
    throw new Error('database password=super-secret and SQL details');
  });

  app.get('/validation-error', () => {
    z.object({ name: z.string() }).parse({});
  });

  app.use(errorHandler);

  return app;
}

describe('centralized error handling', () => {
  it('maps expected application errors to their status and code', async () => {
    const response = await request(createErrorTestApp())
      .get('/expected-error')
      .set('X-Request-Id', 'expected-error-test')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'BAD_REQUEST',
        message: 'The request is invalid',
        requestId: 'expected-error-test',
      },
    });
  });

  it('hides unexpected error details and stack traces', async () => {
    const response = await request(createErrorTestApp()).get('/unexpected-error').expect(500);

    expect(response.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        requestId: expect.any(String),
      },
    });
    expect(JSON.stringify(response.body)).not.toContain('super-secret');
    expect(response.body.error).not.toHaveProperty('stack');
  });

  it('maps Zod validation failures to safe details', async () => {
    const response = await request(createErrorTestApp())
      .get('/validation-error')
      .set('X-Request-Id', 'validation-error-test')
      .expect(400);

    expect(response.body.error).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      requestId: 'validation-error-test',
      details: {
        issues: [{ path: 'name' }],
      },
    });
  });

  it('handles malformed JSON bodies through the central handler', async () => {
    const response = await request(createApp())
      .post('/health')
      .set('Content-Type', 'application/json')
      .send('{"broken":')
      .expect(400);

    expect(response.body.error).toMatchObject({
      code: 'INVALID_JSON',
      message: 'Malformed JSON request body',
    });
  });
});
