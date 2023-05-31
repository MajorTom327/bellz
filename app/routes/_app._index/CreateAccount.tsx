import { Form } from "@remix-run/react";
import { pathOr } from "ramda";
import React, { useState } from "react";
import { Button, Modal, Select } from "react-daisyui";
import { FaPlus, FaTimes } from "react-icons/fa";
import { AuthenticityTokenInput } from "remix-utils";
import AccountType from "~/refs/AccountType";
import CurrencyEnum from "~/refs/CurrencyEnum";

import { FormControl } from "~/components/FormControl";
import SelectControl, { CurrencySelector } from "~/components/SelectControl";

import { useOptionalUser } from "~/hooks/useUser";

type Props = {};

export const CreateAccount: React.FC<Props> = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const user = useOptionalUser();
  const currency = pathOr(CurrencyEnum.EUR, ["profile", "currency"], user);

  const handleClose = () => setShowModal(false);
  const handleOpenModal = () => {
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

            <CurrencySelector defaultValue={currency} />

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
