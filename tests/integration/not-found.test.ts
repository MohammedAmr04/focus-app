import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';

const app = createApp();

describe('unknown routes', () => {
  it('returns a consistent 404 error with a request ID', async () => {
    const response = await request(app)
      .get('/not-a-real-route?token=must-not-appear')
      .set('X-Request-Id', 'unknown-route-test')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
        requestId: 'unknown-route-test',
      },
    });
    expect(response.headers['x-request-id']).toBe('unknown-route-test');
    expect(JSON.stringify(response.body)).not.toContain('must-not-appear');
  });
});
