import { v4 as uuid } from "uuid";
import { prisma } from "~/services.server/db";

export class TeamController {
  invitUser(teamId: string, email: string) {
    console.log("Inviting user", teamId, email);
    return prisma.invitation
      .create({
        data: {
          email,
          team: {
            connect: {
              id: teamId,
            },
          },
          token: uuid(),
        },
      })
      .then((invitation) => {
        // Todo: Send email for invitation

        console.log("Invitation created", invitation.token);

        return invitation;
      });
  }

  async acceptInvitation(token: string, userId: string) {
    return prisma.$transaction(async (prisma) => {
      const invitation = await prisma.invitation.findFirst({
        where: {
          token,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          team: true,
        },
      });

      if (!invitation) {
        throw new Error("Invitation not found");
      }
      const teamId = invitation.teamId;

      const user = await prisma.user.findFirst({
        where: {
          id: userId,
          email: invitation.email,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // * Add the user to the team
      await prisma.team.update({
        where: {
          id: teamId,
        },
        data: {
          members: {
            connect: {
              id: userId,
            },
          },
        },
      });

      // * Remove the invitation
      await prisma.invitation.delete({
        where: {
          id: invitation.id,
        },
      });

      // * Return the team
      return prisma.team.findFirst({
        where: {
          id: teamId,
        },
      });
    });
  }

  removeUserFromTeam(teamId: string, userId: string) {
    return prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        members: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

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
