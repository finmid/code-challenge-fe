import { NextFunction, Request, Response } from 'express';

const number = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const LATENCY_MIN_MS = number(process.env.LATENCY_MIN_MS, 90);
const LATENCY_MAX_MS = number(process.env.LATENCY_MAX_MS, 1400);
/** Share of read requests that fail with a 503. `FAILURE_RATE=0` turns it off. */
const FAILURE_RATE = number(process.env.FAILURE_RATE, 0.14);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The ledger is a Postgres read replica behind a load balancer that somebody
 * else owns. This is what it does in production.
 */
export const unreliableReads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Let the GraphQL playground page itself load; it is a dev tool, not a read.
  if (req.method === 'GET' && (req.headers.accept || '').includes('text/html')) {
    return next();
  }

  const jitter =
    LATENCY_MIN_MS + Math.random() * Math.max(0, LATENCY_MAX_MS - LATENCY_MIN_MS);

  await wait(jitter);

  if (Math.random() < FAILURE_RATE) {
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'ledger replica unavailable, retry',
    });

    return;
  }

  next();
};
