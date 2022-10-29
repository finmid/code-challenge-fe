import { TransactionService } from './TransactionService';
import {
  Transaction,
  TransactionStatus,
  TransactionStatusEnum,
} from '@finmid/lib-common/types';
import data from '../data/transactions.json';

const filter = (status: TransactionStatus, smeId: string) =>
  data.filter((t) => t.status === status && t.smeId === smeId);

describe('TransactionService', () => {
  it('Filters and displays totals correctly', () => {
    const testSmeId = '6fa0ea41-9249-43d5-8479-81af6a55b946'; // Fellowship GmbH
    const totals = Object.values(TransactionStatusEnum).map((curr) => [
      curr,
      filter(curr, testSmeId).length,
    ]);

    totals.forEach(([status, count]) => {
      const service = new TransactionService(data as Transaction[])
        .setLimit(1)
        .setOffset(0)
        .setSmeId(testSmeId)
        .setStatus(status as TransactionStatus);

      const transactions = service.get();

      expect(service.total()).toEqual(count);

      if (count >= 1) {
        expect(transactions.length).toEqual(1);
      } else {
        expect(transactions.length).toEqual(0);
      }
    });
  });
});
