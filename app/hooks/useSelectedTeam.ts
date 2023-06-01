import { useFetcher } from "@remix-run/react";
import { pathOr, prop } from "ramda";
import { useEffect } from "react";
import { useAuthenticityToken } from "remix-utils";
import type { loader } from "~/routes/_app";

import { useMatchesData } from "./useMatchesData";

export const useSelectedTeam = () => {
  const fetcher = useFetcher();
  const setTeamFetcher = useFetcher();
  const csrf = useAuthenticityToken();

  const data = useMatchesData<typeof loader>("routes/_app");

  useEffect(() => {
    fetcher.load("/teams");
  }, [fetcher.load]);

  const setTeam = (teamId: string) => {
    setTeamFetcher.submit(
      {
        csrf,
        teamId,
      },
      {
        method: "POST",
        action: "/api/preferences/team",
      }
    );
  };

  return {
    teams: pathOr([], ["data", "teams"], fetcher),
    setTeam,
    team: prop("teamId", data),
  };
};
