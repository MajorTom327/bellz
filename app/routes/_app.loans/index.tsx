import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Card } from "react-daisyui";
import { promiseHash } from "remix-utils";
import zod from "zod";
import CurrencyEnum from "~/refs/CurrencyEnum";

import ensureCsrf from "~/lib/authorization/ensureCsrf";
import ensureUser from "~/lib/authorization/ensureUser";

import LoanController from "~/controllers/LoanController";

import ErrorHandler from "~/components/ErrorHandler";

import CreateLoan from "./CreateLoan";
import LoanList from "./LoanList";
import LoanStats from "./LoanStats";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureUser(request);

  const loanController = new LoanController();

  return json(
    await promiseHash({
      loans: loanController.getLoansForUser(user.id),
      summary: loanController.getLoansSummaryForUser(user.id),
    })
  );
};

export const AppLoans = () => {
  const { loans, summary } = useLoaderData<typeof loader>();

  return (
    <>
      <CreateLoan />
      <div className="flex flex-col gap-2">
        <LoanStats summary={summary} />
        <Card>
          <Card.Body>
            <Card.Title>
              <h2>Loans</h2>
            </Card.Title>
            <LoanList loans={loans} />
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export const action: ActionFunction = async ({ request }) => {
  await ensureCsrf(request);
  const user = await ensureUser(request);

  const formData = await request.formData();
  const entries = Object.fromEntries(formData.entries());

  const data = zod
    .object({
      label: zod.string().min(1).max(255),
      amount: zod.coerce.number().min(0),
      currency: zod.nativeEnum(CurrencyEnum),
    })
    .parse(entries);

  const loanController = new LoanController();

  const loan = await loanController.createLoan(user.id, data);

  return json({
    loan,
  });
};

export const ErrorBoundary = ErrorHandler;

export default AppLoans;
