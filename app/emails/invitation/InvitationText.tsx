import React from "react";

import type { InvitationEmailParams } from ".";

export const InvitationText: React.FC<InvitationEmailParams> = ({
  acceptLink,
}) => {
  return (
    <>
      You have been invited to join a team. Please go on this link to accept the
      invitation {acceptLink}
    </>
  );
};

InvitationText.defaultProps = {};

export default InvitationText;
