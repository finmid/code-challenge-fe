import { Job, JobStatus } from '@finmid/lib-common/types';

export class JobService {
  readonly data: Job[];

  // filter fields
  crewId: string | null = null;
  plannerId: string | null = null;
  status: JobStatus | null = null;

  // pagination fields
  limit: number = 10;
  offset: number = 0;

  constructor(data: Job[]) {
    this.data = [...data];
  }

  setCrewId(crewId: string) {
    this.crewId = crewId;

    return this;
  }

  setPlannerId(plannerId?: string | null) {
    if (plannerId !== undefined) this.plannerId = plannerId;

    return this;
  }

  setStatus(status?: JobStatus | null) {
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

  filteredResults() {
    return this.data.filter((job) => {
      if (this.crewId && this.crewId !== job.crewId) return false;
      if (this.status && this.status !== job.status) return false;
      if (this.plannerId && this.plannerId !== job.plannerId) return false;

      return true;
    });
  }

  total() {
    return this.filteredResults().length;
  }

  get() {
    const startIndex = this.offset;
    const endIndex = this.offset + this.limit;

    return this.filteredResults().slice(startIndex, endIndex);
  }
}
