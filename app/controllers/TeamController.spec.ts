import { describe, expect, it, vi } from "vitest";
import prisma from "~/services.server/__mocks__/db";

import { TeamController } from "./TeamController";

vi.mock("~/services.server/db");

describe("GetTeams for user", () => {
  it("Should get no team if none", async () => {
    prisma.team.findMany.mockResolvedValue([]);

    const teamController = new TeamController();

    const teams = teamController.getTeamsForUser("1");

    expect(teams).toEqual([]);
    expect(prisma.team.findMany).toHaveBeenCalled();
  });

  it("Should get the owned teams", async () => {
    prisma.team.findMany.mockResolvedValue([]);

    const teamController = new TeamController();

    const teams = teamController.getTeamsForUser("1");

    expect(teams).toEqual([]);
    const params = prisma.team.findMany.mock.lastCall;

    expect(params).toHaveAttribute("where");
  });
});
