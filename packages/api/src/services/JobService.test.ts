import { JobService } from './JobService';
import { Job, JobStatus, JobStatusEnum } from '@finmid/lib-common/types';
import data from '../data/jobs.json';

const filter = (status: JobStatus, crewId: string) =>
  data.filter((job) => job.status === status && job.crewId === crewId);

describe('JobService', () => {
  it('Filters and counts correctly', () => {
    const testCrewId = '6fa0ea41-9249-43d5-8479-81af6a55b946'; // Fellowship Logistics GmbH
    const totals = Object.values(JobStatusEnum).map((status) => [
      status,
      filter(status, testCrewId).length,
    ]);

    totals.forEach(([status, count]) => {
      const service = new JobService(data as Job[])
        .setLimit(1)
        .setOffset(0)
        .setCrewId(testCrewId)
        .setStatus(status as JobStatus);

      const jobs = service.get();

      expect(service.total()).toEqual(count);

      if (count >= 1) {
        expect(jobs.length).toEqual(1);
      } else {
        expect(jobs.length).toEqual(0);
      }
    });
  });
});
