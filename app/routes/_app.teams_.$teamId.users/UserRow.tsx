import type { User } from "@prisma/client";
import { useFetcher, useParams } from "@remix-run/react";
import React from "react";
import { Button } from "react-daisyui";
import { AuthenticityTokenInput } from "remix-utils";

import { useOptionalUser } from "~/hooks/useUser";

type Props = {
  user: User;
};

export const UserRow: React.FC<Props> = ({ user }) => {
  const currentUser = useOptionalUser();
  const fetcher = useFetcher();
  const { teamId } = useParams();

  const isCurrent = currentUser?.id === user.id;

  return (
    <>
      <tr key={user.id}>
        <td>{user.email}</td>
        <td>
          <fetcher.Form
            method="DELETE"
            action={`/teams/${teamId}/users/${user.id}`}
          >
            <AuthenticityTokenInput />
            <Button
              type="submit"
              color="error"
              disabled={fetcher.state === "submitting" || isCurrent}
            >
              Remove
            </Button>
          </fetcher.Form>
        </td>
      </tr>
    </>
  );
};

UserRow.defaultProps = {};

export default UserRow;
