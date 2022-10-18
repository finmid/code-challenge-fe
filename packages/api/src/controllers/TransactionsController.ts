import { Request, Response } from 'express';
import { z } from 'zod';
import data from 'src/data/transactions.json';
import {
  Transaction,
  TransactionStatusEnum,
} from '@finmid/lib-common/types/Transaction';
import { validateRequest, numericString } from 'src/lib/validation';
import { TransactionService } from 'src/services';

const getTransactions = async (req: Request, res: Response) => {
  const statusArray = Object.values(TransactionStatusEnum);
  const transactionQueryValidation = z.object({
    body: z.object({
      userData: z.object({
        smeId: z.string().min(1),
      }),
    }),
    query: z.object({
      status: z.enum([statusArray[0], ...statusArray.slice(1)]).optional(),
      limit: numericString(z.number().positive().optional().default(10)),
      offset: numericString(z.number().nonnegative().optional().default(0)),
      userId: z.string().optional(),
    }),
  });

  const {
    body: {
      userData: { smeId },
    },
    query: { status, userId, limit, offset },
  } = validateRequest(transactionQueryValidation, req);

  const transactions = new TransactionService(data as Transaction[])
    .setLimit(limit)
    .setSmeId(smeId)
    .setStatus(status)
    .setUserId(userId)
    .setOffset(offset)
    .get();

  res.status(200).json({
    data: transactions,
    meta: {
      limit,
      offset,
      status,
      userId,
      smeId,
    },
  });
};

export const TransactionsController = {
  getTransactions,
};
