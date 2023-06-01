import type { Team } from "@prisma/client";
import { isEmpty } from "ramda";
import React from "react";
import { Select } from "react-daisyui";

import { useSelectedTeam } from "~/hooks/useSelectedTeam";

type Props = {};

export const SelectTeam: React.FC<Props> = ({}) => {
  const { teams, setTeam, team } = useSelectedTeam();

  if (isEmpty(teams)) return null;

  const handleChangeTeam = (e: any) => {
    setTeam(e.target.value);
  };

  return (
    <>
      <Select color="ghost" size="sm" onChange={handleChangeTeam} value={team}>
        <Select.Option value="">No team selected</Select.Option>
        {/* @ts-ignore */}
        {teams.map((team: Team) => (
          <Select.Option key={team.id} value={team.id}>
            {team.name}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

SelectTeam.defaultProps = {};

export default SelectTeam;
