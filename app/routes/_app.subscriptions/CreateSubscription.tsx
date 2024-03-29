import type { Account } from "@prisma/client";
import { Form } from "@remix-run/react";
import { DateTime } from "luxon";
import { pathOr, values } from "ramda";
import React from "react";
import { Button, Modal, Select, Toggle } from "react-daisyui";
import { FaTimes } from "react-icons/fa";
import { AuthenticityTokenInput } from "remix-utils";
import CurrencyEnum from "~/refs/CurrencyEnum";
import OccurenceEnum from "~/refs/OccurenceEnum";

import { FormControl } from "~/components/FormControl";
import { SelectControl } from "~/components/SelectControl";
import { SubscriptionTypeInput } from "~/components/SubscriptionTypeInput";

import { useOptionalUser } from "~/hooks/useUser";

type Props = {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
};

export const CreateSubscription: React.FC<Props> = ({
  open,
  onClose,
  accounts,
}) => {
  return (
    <>
      <Modal open={open} onClickBackdrop={onClose}>
        <Form method="POST" action="/subscriptions">
          <Modal.Header className="flex justify-between">
            <h1 className="text-2xl font-semibold">
              Create Subscription or Income
            </h1>
            <Button
              onClick={onClose}
              type="button"
              color="ghost"
              size="sm"
              shape="square"
            >
              <FaTimes />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <AuthenticityTokenInput />

            <SubscriptionTypeInput />

            <FormControl name="name" label="Name" />
            <FormControl name="amount" label="Amount" type="number" />
            <FormControl
              name="nextExecution"
              label="Next occurence"
              type="datetime-local"
              defaultValue={
                DateTime.local()
                  .startOf("minute")
                  .startOf("second")
                  .toISO({ includeOffset: false }) ?? undefined
              }
            />

            <SelectControl
              name="occurence"
              label="Occurence"
              defaultValue={OccurenceEnum.MONTHLY}
            >
              {values(OccurenceEnum).map((occurence) => (
                <Select.Option key={occurence} value={occurence}>
                  {occurence}
                </Select.Option>
              ))}
            </SelectControl>

            <SelectControl name="accountId" label="Account">
              {accounts.map((account: Account) => (
                <Select.Option key={account.id} value={account.id}>
                  {account.name} ({pathOr("?", ["currency"], account)})
                </Select.Option>
              ))}
            </SelectControl>
          </Modal.Body>
          <Modal.Actions className="flex justify-end">
            <Button color="primary" type="submit">
              Create
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    </>
  );
};

CreateSubscription.defaultProps = {};

export default CreateSubscription;
