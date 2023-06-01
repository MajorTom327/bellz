import { useFetcher } from "@remix-run/react";
import { set } from "ramda";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-daisyui";
import { FaPlus, FaTimes } from "react-icons/fa";

import { FormControl } from "~/components/FormControl";

type Props = {};

export const CreateTeam: React.FC<Props> = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const fetcher = useFetcher();

  const handleOpenModal = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.type === "done") {
      handleClose();
    }
  }, [fetcher.state]);

  return (
    <>
      <div className="fixed bottom-4 right-4">
        <Button
          shape="circle"
          size="lg"
          color="primary"
          className="text-3xl"
          onClick={handleOpenModal}
        >
          <FaPlus />
        </Button>
      </div>
      <Modal open={showModal} onClickBackdrop={handleClose}>
        <fetcher.Form method="POST" action="/teams">
          <Modal.Header className="flex justify-between items-center">
            <h3 className="font-primary">Create Account</h3>
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
            <FormControl label="Account label" name="name" />
          </Modal.Body>

          <Modal.Actions>
            <Button
              type="submit"
              color="primary"
              disabled={fetcher.state === "submitting"}
            >
              Create
            </Button>
          </Modal.Actions>
        </fetcher.Form>
      </Modal>
    </>
  );
};

CreateTeam.defaultProps = {};

export default CreateTeam;
