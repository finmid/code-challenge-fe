import {
  Transaction,
  TransactionStatus,
} from "@finmid/lib-common/types/Transaction";

export class TransactionService {
  readonly data: Transaction[];

  // filter fields
  smeId: string | null = null;
  userId: string | null = null;
  status: TransactionStatus | null = null;

  // pagination fields
  limit: number = 10;
  offset: number = 0;

  constructor(data: Transaction[]) {
    this.data = [...data];
  }

  setSmeId(smeId: string) {
    this.smeId = smeId;

    return this;
  }

  setUserId(userId?: string | null) {
    if (userId !== undefined) this.userId = userId;

    return this;
  }

  setStatus(status?: TransactionStatus | null) {
    if (status !== undefined) this.status = status;

    return this;
  }

  setLimit(_limit?: number) {
    if (_limit) this.limit = _limit;

    return this;
  }

  setOffset(offset?: number) {
    if (offset) this.offset = offset;

    return this;
  }

  get() {
    let result: Transaction[] = [...this.data];

    result = result.filter((transaction) => {
      if (this.smeId && this.smeId !== transaction.smeId) return false;
      if (this.status && this.status !== transaction.status) return false;

      return true;
    });

    const startIndex = this.offset;
    const endIndex = this.offset + this.limit;

    result = result.slice(startIndex, endIndex).filter((result) => {
      if (this.userId) return this.userId === result.userId;
      return result;
    });

    return result;
  }
}
