import type { RequestHandler } from 'express';

export const getHealth: RequestHandler = (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ status: 'ok' });
};
