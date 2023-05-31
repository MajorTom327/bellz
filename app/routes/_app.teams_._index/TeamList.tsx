import type { Team } from "@prisma/client";
import React from "react";
import { Card } from "react-daisyui";
import { FaUserPlus, FaWrench } from "react-icons/fa";

import { ButtonLink } from "~/components/ButtonLink";

import { useOptionalUser } from "~/hooks/useUser";

type Props = {
  teams: Team[];
};

export const TeamList: React.FC<Props> = ({ teams }) => {
  const user = useOptionalUser();

  return (
    <>
      <div className="flex flex-col gap-2">
        {teams.map((team) => (
          <Card key={team.id}>
            <Card.Body>
              <Card.Title>
                <div className="w-full flex justify-between items-center">
                  <h3 className="font-primary">{team.name}</h3>
                  <div className="flex gap-2">
                    <ButtonLink to={`/teams/${team.id}/accounts`}>
                      Team's accounts
                    </ButtonLink>
                    <ButtonLink to={`/teams/${team.id}`}>
                      <FaWrench />
                    </ButtonLink>
                    {user?.id === team.ownerId && (
                      <ButtonLink
                        color="primary"
                        to={`/teams/${team.id}/users`}
                        className="text-xl"
                      >
                        <FaUserPlus />
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

TeamList.defaultProps = {};

export default TeamList;
