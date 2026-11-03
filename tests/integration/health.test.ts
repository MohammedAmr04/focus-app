import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';

const app = createApp();

describe('GET /health', () => {
  it('reports that the API process is running', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toEqual({ status: 'ok' });
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers['x-request-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('propagates a safe incoming request ID', async () => {
    const response = await request(app)
      .get('/health')
      .set('X-Request-Id', 'test-request-123')
      .expect(200);

    expect(response.headers['x-request-id']).toBe('test-request-123');
  });

  it('allows only explicitly configured CORS origins', async () => {
    const allowed = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:5173')
      .expect(200);

    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(allowed.headers['access-control-expose-headers']).toBe('X-Request-Id');

    const denied = await request(app)
      .get('/health')
      .set('Origin', 'https://untrusted.example.com')
      .expect(200);

    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });
});
