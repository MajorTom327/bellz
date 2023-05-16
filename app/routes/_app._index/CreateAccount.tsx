import { Form } from "@remix-run/react";
import React, { useState } from "react";
import { Button, Modal } from "react-daisyui";
import { FaPlus, FaTimes } from "react-icons/fa";
import { AuthenticityTokenInput } from "remix-utils";

import { FormControl } from "~/components/FormControl";

type Props = {};

export const CreateAccount: React.FC<Props> = ({}) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  return (
    <>
      <div className="fixed bottom-4 right-4">
        <Button
          shape="circle"
          size="lg"
          color="primary"
          className="text-3xl"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
        </Button>
      </div>
      <Modal open={showModal} onClickBackdrop={handleClose}>
        <Form method="POST" action="/accounts">
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
            <FormControl label="Account label" name="label" />
            <FormControl label="Initial Balance" name="balance" type="number" />
            <AuthenticityTokenInput />
          </Modal.Body>
          <Modal.Actions>
            <Button type="submit" color="primary">
              Create
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    </>
  );
};

CreateAccount.defaultProps = {};

export default CreateAccount;
