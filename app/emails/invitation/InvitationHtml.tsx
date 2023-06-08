import React from "react";

import type { InvitationEmailParams } from ".";

export const InvitationHtml: React.FC<InvitationEmailParams> = ({
  acceptLink,
}) => {
  return (
    <>
      <h1>Invitation to a team</h1>
      <p>
        Welcome, an user invit you to join his team, to accept, you should click
        on the button below.
      </p>
      <p>Note that the link should expire in 7 days</p>
      <a href={acceptLink}>Accept invitation</a>
    </>
  );
};

InvitationHtml.defaultProps = {};

export default InvitationHtml;
