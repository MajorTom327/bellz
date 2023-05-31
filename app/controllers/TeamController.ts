import { prisma } from "~/services.server/db";

export class TeamController {
  getUsersInTeam(teamId: string) {
    return prisma.user.findMany({
      where: {
        teams: {
          some: {
            id: teamId,
          },
        },
      },
    });
  }

  getTeamById(userId: string, teamId: string) {
    return prisma.team.findFirst({
      where: {
        id: teamId,
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
    });
  }
  getTeamsForUser(userId: string) {
    return prisma.team.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
      // Todo: Add accounts
      // include: {
      // },
    });
  }

  createTeam(name: string, ownerId: string) {
    return prisma.team.create({
      data: {
        name,
        ownerId,
      },
    });
  }
}

export default TeamController;
