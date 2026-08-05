import { Request, Response } from 'express';
import crewMembers from 'src/data/crew-members.json';

const getCrewMembers = (req: Request, res: Response) => {
  const crewId = req.body.userData.crewId;
  const members = crewMembers
    .filter((member) => member.crewId === crewId)
    .map(({ password, ...member }) => member);

  res.status(200).json(members);
};

export const CrewMembersController = {
  getCrewMembers,
};
