import { Form, useFetcher } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-daisyui";
import { FaPlus, FaTimes } from "react-icons/fa";
import { AuthenticityTokenInput } from "remix-utils";

import { FormControl } from "~/components/FormControl";
import { CurrencySelector } from "~/components/SelectControl";

type Props = {};

export const CreateLoan: React.FC<Props> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.type === "done") {
      handleCloseModal();
    }
  }, [fetcher.state, fetcher.type]);

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
      <Modal open={isModalOpen} onClickBackdrop={handleCloseModal}>
        <fetcher.Form method="POST" action="/loans">
          <Modal.Header className="flex justify-between items-center">
            <h3 className="font-primary">Create Loan</h3>
            <Button
              onClick={handleCloseModal}
              type="button"
              shape="square"
              size="sm"
              color="ghost"
            >
              <FaTimes />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <AuthenticityTokenInput />
            <FormControl label="Loan label" name="label" />
            <FormControl label="Amount" name="amount" type="number" />
            <CurrencySelector />
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

CreateLoan.defaultProps = {};

export default CreateLoan;
