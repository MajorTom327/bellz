import type { Team } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { isEmpty, pathOr } from "ramda";
import React, { useEffect, useState } from "react";
import { Select } from "react-daisyui";

type Props = {};

export const SelectTeam: React.FC<Props> = ({}) => {
  const fetcher = useFetcher();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    fetcher.load("/teams");
  }, [fetcher.load]);

  const teams = pathOr([], ["data", "teams"], fetcher);

  if (isEmpty(teams)) return null;

  return (
    <>
      <Select color="ghost" size="sm">
        {teams.map((team: Team) => (
          <Select.Option key={team.id}>{team.name}</Select.Option>
        ))}
      </Select>
    </>
  );
};

SelectTeam.defaultProps = {};

export default SelectTeam;
