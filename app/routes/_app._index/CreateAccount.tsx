import { Form } from "@remix-run/react";
import React, { useState } from "react";
import { Button, Modal, Select } from "react-daisyui";
import { FaPlus, FaTimes } from "react-icons/fa";
import { AuthenticityTokenInput } from "remix-utils";
import AccountType from "~/refs/AccountType";

import { FormControl } from "~/components/FormControl";
import SelectControl from "~/components/SelectControl";

type Props = {};

export const CreateAccount: React.FC<Props> = ({}) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleOpenModal = () => {
    console.log("Handle open modal");
    setShowModal(true);
  };

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
            <SelectControl label="Account Type" name="accountType">
              <option value={AccountType.Cash}>Cash</option>
              <option value={AccountType.Safe}>Safe</option>
              <option value={AccountType.Wallet}>Wallet</option>
              <option value={AccountType.Bank}>Bank</option>
            </SelectControl>
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
