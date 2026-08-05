import { Values } from './helpers';
import { Currency, TakingsEntry } from './Takings';

export const JobStatusEnum = {
  /** Scouting it. Nothing has happened yet. */
  Casing: 'CASING',
  /** In progress right now. */
  Running: 'RUNNING',
  /** Went the way it was supposed to. */
  Scored: 'SCORED',
  /** Went wrong. Nothing came out. */
  Burned: 'BURNED',
  /** Came out, then the police took it back. */
  Seized: 'SEIZED',
} as const;

export type JobStatus = Values<typeof JobStatusEnum>;

export const ExpensePolicyEnum = {
  /** Expenses come out of the haul before anybody is paid. */
  OffTheTop: 'OFF_THE_TOP',
  /** Expenses are deducted from the shares of whoever is being paid. */
  FromShares: 'FROM_SHARES',
  /** Whoever fronted the money eats it. */
  PaidByFronter: 'PAID_BY_FRONTER',
} as const;

export type ExpensePolicy = Values<typeof ExpensePolicyEnum>;

export const CutKindEnum = {
  /** A percentage of the job. Of what, exactly, is the argument. */
  Percent: 'PERCENT',
  /** A fixed fee, paid regardless of how the job went. */
  Flat: 'FLAT',
} as const;

export type CutKind = Values<typeof CutKindEnum>;

export type Expense = {
  id: string;
  label: string; // "Transit van, three days"
  amount: string; // "1250.00"
  currency: Currency;
  /** Crew member who put the money up, or null if the crew fund did. */
  frontedBy: string | null;
};

export type Cut = {
  crewMemberId: string;
  kind: CutKind;
  /** Set when `kind` is PERCENT. "22.5" means 22.5%. */
  percent: string | null;
  /** Set when `kind` is FLAT. */
  amount: string | null;
  currency: Currency | null;
  note: string | null; // "agreed in the pub, no witnesses"
};

export type Job = {
  id: string;
  crewId: string;
  /** Crew member who put the job together. */
  plannerId: string;
  codename: string; // "SILVERWARE"
  targetName: string; // "Zendesk"
  targetIconUrl: string; // absolute, points at the API's /static mount
  city: string; // "Berlin"
  status: JobStatus;
  /** ISO. The night of the job, or the night it is planned for. */
  jobTime: string;
  /** Empty for CASING and RUNNING. Populated for SEIZED, even though it is gone. */
  takings: TakingsEntry[];
  expenses: Expense[];
  cuts: Cut[];
  /**
   * How `expenses` interact with `cuts`. Null on older jobs, where nobody
   * wrote it down.
   */
  expensePolicy: ExpensePolicy | null;
  /** The fence's slice, taken before the crew splits anything. "12.5" = 12.5%. */
  fenceFeePercent: string;
  /** Set for BURNED and SEIZED. */
  failureNote: string | null;
};
