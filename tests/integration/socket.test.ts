import { createServer } from 'node:http';

import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';
import { closeSocketServer, createSocketServer } from '../../src/infrastructure/realtime/socket.js';

describe('Socket.IO integration', () => {
  it('serves a handshake on the same HTTP server as Express', async () => {
    const httpServer = createServer(createApp());
    const io = createSocketServer(httpServer);

    await new Promise<void>((resolve, reject) => {
      httpServer.once('error', reject);
      httpServer.listen(0, '127.0.0.1', resolve);
    });

    try {
      const address = httpServer.address();
      if (address === null || typeof address === 'string') {
        throw new Error('Expected the test server to listen on a TCP port');
      }

      const response = await fetch(
        `http://127.0.0.1:${address.port}/socket.io/?EIO=4&transport=polling`,
      );

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toContain('"sid"');
    } finally {
      await closeSocketServer(io);

      if (httpServer.listening) {
        await new Promise<void>((resolve) => {
          httpServer.close(() => resolve());
        });
      }
    }
  });
});
