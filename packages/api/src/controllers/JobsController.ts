import { Request, Response } from 'express';
import { notFound } from '@hapi/boom';
import { z } from 'zod';
import data from 'src/data/jobs.json';
import { Job, JobStatusEnum } from '@finmid/lib-common/types';
import { validateRequest, numericString } from 'src/lib/validation';
import { JobService } from 'src/services';

const getJobs = async (req: Request, res: Response) => {
  const statusArray = Object.values(JobStatusEnum);
  const jobQueryValidation = z.object({
    body: z.object({
      userData: z.object({
        crewId: z.string().min(1),
      }),
    }),
    query: z.object({
      status: z.enum([statusArray[0], ...statusArray.slice(1)]).optional(),
      limit: numericString(z.number().positive().optional().default(10)),
      offset: numericString(z.number().nonnegative().optional().default(0)),
      plannerId: z.string().optional(),
    }),
  });

  const {
    body: {
      userData: { crewId },
    },
    query: { status, plannerId, limit, offset },
  } = validateRequest(jobQueryValidation, req);

  const service = new JobService(data as Job[])
    .setLimit(limit)
    .setCrewId(crewId)
    .setStatus(status)
    .setPlannerId(plannerId)
    .setOffset(offset);

  const jobs = service.get();
  const total = service.total();

  res.status(200).json({
    data: jobs,
    meta: {
      limit,
      offset,
      status,
      plannerId,
      crewId,
      total,
    },
  });
};

const getJob = async (req: Request, res: Response) => {
  const crewId = req.body.userData.crewId;
  const job = (data as Job[]).find(
    (job) => job.id === req.params.id && job.crewId === crewId
  );

  if (!job) {
    throw notFound('Job not found');
  }

  res.status(200).json(job);
};

export const JobsController = {
  getJobs,
  getJob,
};
