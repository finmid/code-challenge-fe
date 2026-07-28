import { Values } from './helpers';

export const CrewMemberStandingEnum = {
  Active: 'ACTIVE',
  InCustody: 'IN_CUSTODY',
  Retired: 'RETIRED',
} as const;

export type CrewMemberStanding = Values<typeof CrewMemberStandingEnum>;

/**
 * The crew's front company. Everything in the ledger hangs off one of these.
 */
export type Crew = {
  id: string;
  legalName: string; // "Fellowship Logistics GmbH"
  frontBusiness: string; // "REMOVALS", "SCRAP_METAL", ...
};

export type CrewMember = {
  id: string;
  crewId: string;
  name: string; // "Gandalf the Grey"
  alias: string; // "The Grey"
  role: string; // "PLANNER", "WHEELS", "INSIDE", ...
  standing: CrewMemberStanding;
  email: string;
  profileImage: string; // absolute, points at the API's /static mount
};
