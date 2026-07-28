import { notFound } from '@hapi/boom';
import { Request, Response } from 'express';
import crews from 'src/data/crews.json';

const getCrew = async (req: Request, res: Response) => {
  const crewId = req.body.userData.crewId;
  const crew = crews.find((crew) => crew.id === crewId);

  if (!crew) {
    throw notFound('Crew not found');
  }

  res.json(crew);
};

export const CrewsController = {
  getCrew,
};
