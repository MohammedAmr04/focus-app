import type { Server as HttpServer } from 'node:http';

import { Server } from 'socket.io';

import { logger } from '../../common/logging/logger.js';
import { env } from '../../config/env.js';

const MAX_PAYLOAD_BYTES = 1_000_000;

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    serveClient: false,
    path: '/socket.io',
    cors: {
      origin: [...env.CORS_ORIGIN],
      methods: ['GET', 'POST'],
      credentials: false,
    },
    transports: ['polling', 'websocket'],
    maxHttpBufferSize: MAX_PAYLOAD_BYTES,
    pingInterval: 25_000,
    pingTimeout: 20_000,
    connectTimeout: 10_000,
    perMessageDeflate: false,
    cookie: false,
  });

  // Authentication and authorization middleware belongs here, before any
  // protected feature event handlers are registered.
  io.on('connection', (socket) => {
    const socketLogger = logger.child({
      socketId: socket.id,
      transport: socket.conn.transport.name,
    });

    socketLogger.info('Socket connected');

    socket.on('disconnect', (reason) => {
      socketLogger.info({ reason }, 'Socket disconnected');
    });
  });

  return io;
}

export function closeSocketServer(io: Server): Promise<void> {
  // Closing the Socket.IO server also closes the HTTP server it is attached to.
  return io.close();
}
