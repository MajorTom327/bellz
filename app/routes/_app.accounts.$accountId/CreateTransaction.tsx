import { Form, useNavigation, useParams } from "@remix-run/react";
import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-daisyui";
import { FaTimes } from "react-icons/fa";
import { AuthenticityTokenInput } from "remix-utils";
import zod from "zod";

import { FormControl } from "~/components/FormControl";

export const CreateTransaction: React.FC = () => {
  const params = useParams();
  const { accountId } = zod.object({ accountId: zod.string() }).parse(params);
  const [isOpen, setOpen] = useState(false);

  const transition = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);

  const isSubmitting = transition.state === "submitting";

  const handleCloseModal = () => {
    setOpen(false);
    formRef.current?.reset();
  };

  useEffect(() => {
    if (transition.state === "submitting") {
      handleCloseModal();
    }
  }, [transition.state]);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        New transaction
      </Button>
      <Modal open={isOpen} onClickBackdrop={handleCloseModal}>
        <Form
          action={`/accounts/${accountId}/transactions`}
          method="POST"
          ref={formRef}
        >
          <Modal.Header className="flex justify-between">
            <h1 className="text-2xl">New transaction</h1>
            <Button
              onClick={handleCloseModal}
              type="button"
              color="ghost"
              size="sm"
              shape="square"
            >
              <FaTimes />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <FormControl
              disabled={isSubmitting}
              label="Description"
              name="description"
            />
            <FormControl
              disabled={isSubmitting}
              label="Amount"
              name="amount"
              type="number"
            />
            <FormControl
              disabled={isSubmitting}
              label="Date"
              name="date"
              type="date"
              defaultValue={DateTime.local().toISODate() ?? undefined}
            />
            <AuthenticityTokenInput />
          </Modal.Body>
          <Modal.Actions>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              Create
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    </>
  );
};

CreateTransaction.defaultProps = {};

export default CreateTransaction;
