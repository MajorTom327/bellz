import { useFetcher, useParams } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-daisyui";
import { FaTimes } from "react-icons/fa";
import { AuthenticityTokenInput } from "remix-utils";

import { FormControl } from "~/components/FormControl";

type Props = {};

export const InvitUser: React.FC<Props> = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const fetcher = useFetcher();

  const { teamId } = useParams();

  const handleOpenModal = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.type === "done") {
      handleClose();
    }
  }, [fetcher.state, fetcher.type]);

  return (
    <>
      <Button onClick={handleOpenModal}>Invit a new user</Button>

      <Modal open={showModal} onClickBackdrop={handleClose}>
        <fetcher.Form method="POST" action={`/teams/${teamId}/users/invit`}>
          <Modal.Header className="flex justify-between items-center">
            <h3>Invit a new user</h3>
            <Button
              onClick={handleClose}
              type="button"
              shape="square"
              size="sm"
              color="ghost"
            >
              <FaTimes />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <FormControl label="Email" name="email" />
            <AuthenticityTokenInput />
          </Modal.Body>
          <Modal.Actions>
            <Button
              type="submit"
              color="primary"
              disabled={fetcher.state === "submitting"}
            >
              Invit
            </Button>
          </Modal.Actions>
        </fetcher.Form>
      </Modal>
    </>
  );
};

InvitUser.defaultProps = {};

export default InvitUser;
