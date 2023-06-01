import type { Loan } from "@prisma/client";
import { Form, useFetcher, useNavigation, useParams } from "@remix-run/react";
import classNames from "classnames";
import { DateTime } from "luxon";
import { not, pathOr } from "ramda";
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Select } from "react-daisyui";
import { FaTimes } from "react-icons/fa";
import { AuthenticityTokenInput } from "remix-utils";
import zod from "zod";
import type CurrencyEnum from "~/refs/CurrencyEnum";

import { FormControl } from "~/components/FormControl";
import { MoneyFormat } from "~/components/MoneyFormat";
import { SelectControl } from "~/components/SelectControl";

export const CreateTransaction: React.FC = () => {
  const params = useParams();
  const { accountId } = zod.object({ accountId: zod.string() }).parse(params);
  const [isOpen, setOpen] = useState(false);

  const transition = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);

  const isSubmitting = transition.state === "submitting";
  const defaultDate =
    DateTime.local()
      .startOf("minute")
      .startOf("second")
      .toISO({ includeOffset: false }) ?? undefined;

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
            <DirectionSelector />
            <LoanSelector />
            <FormControl
              disabled={isSubmitting}
              label="Date"
              name="date"
              type="datetime-local"
              defaultValue={defaultDate}
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

const DirectionSelector = () => {
  const [isExpense, setIsExpense] = useState(false);
  return (
    <>
      <label className="label" htmlFor="#transactionDirection">
        <span className="label-text">Income or expense ?</span>
      </label>
      <input
        id="transactionDirection"
        type="hidden"
        readOnly
        name="isExpense"
        value={isExpense.toString()}
      />
      <div className="flex justify-center">
        <div
          className="w-48 h-16 border rounded-lg overflow-hidden p-2 bg-base-200 shadow-inner cursor-pointer "
          onClick={() => setIsExpense(not)}
        >
          <div
            className={classNames(
              "w-1/2 h-full rounded shadow transform transition-all",
              {
                "translate-x-full bg-error/60 text-error-content": isExpense,
                "bg-primary/60 text-primary-content": not(isExpense),
              }
            )}
          >
            <div className="flex items-center justify-center h-full select-none ">
              {isExpense ? <span>Expense</span> : <span>Income</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const LoanSelector = () => {
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.load("/loans");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loans = pathOr<Loan[]>([], ["data", "loans"], fetcher);

  return (
    <>
      <SelectControl label="Loan" name="loanId">
        <option>Select a loan to associate with</option>
        {/* @ts-ignore */}
        {loans.map((loan) => (
          <Select.Option value={loan.id} key={loan.id}>
            {loan.label} (
            <MoneyFormat
              value={loan.amount}
              currency={loan.currency as CurrencyEnum}
            />
            )
          </Select.Option>
        ))}
      </SelectControl>
    </>
  );
};

CreateTransaction.defaultProps = {};

export default CreateTransaction;
