import crewMembers from 'src/data/crew-members.json';

export const getCrewMembers = (crewId?: string) => {
  return crewMembers
    .filter((member) => member.crewId === crewId)
    .map((member) => ({
      id: member.id,
      name: member.name,
      alias: member.alias,
      role: member.role,
      standing: member.standing,
      email: member.email,
      profileImage: member.profileImage,
    }));
};
