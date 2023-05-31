import type { Account } from "@prisma/client";
import React from "react";
import { Card } from "react-daisyui";

type Props = {
  accounts: Account[];
};

export const OtherAccounts: React.FC<Props> = ({}) => {
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            <h3 className="font-primary">Accounts from other team's member</h3>
          </Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

OtherAccounts.defaultProps = {};

export default OtherAccounts;
