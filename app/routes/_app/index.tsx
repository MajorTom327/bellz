import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, NavLink, Outlet } from "@remix-run/react";
import { json } from "@vercel/remix";
import { not, prop } from "ramda";
import { useState } from "react";
import { Button, Drawer, Menu, Navbar } from "react-daisyui";
import { FaBars } from "react-icons/fa";
import { AuthenticityTokenInput, badRequest } from "remix-utils";
import zod from "zod";
import { sessionStorage } from "~/services.server/session";

import ensureCsrf from "~/lib/authorization/ensureCsrf";
import ensureUser from "~/lib/authorization/ensureUser";

import TeamController from "~/controllers/TeamController";

import { ButtonLink } from "~/components/ButtonLink";
import ErrorHandler from "~/components/ErrorHandler";
import SelectTeam from "~/components/SelectTeam/SelectTeam";

import { useOptionalUser } from "~/hooks/useUser";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return json<LoaderData>({
    teamId: session.get("teamId"),
  });
};

export const App = () => {
  const user = useOptionalUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Drawer
        open={isSidebarOpen}
        mobile
        onClickOverlay={() => setIsSidebarOpen(false)}
        side={
          <Sidebar
            isLogged={Boolean(user)}
            onClose={() => setIsSidebarOpen(false)}
          />
        }
        overlayClassName="lg:hidden"
        sideClassName="lg:border-r"
      >
        <Navbar className="bg-base-100 shadow-xl">
          <Navbar.Start className="flex gap-2">
            <ButtonLink color="ghost" to="/">
              Bellz
            </ButtonLink>
            <Button
              color="ghost"
              onClick={() => setIsSidebarOpen(not)}
              className="lg:hidden"
            >
              <FaBars />
            </Button>
            <SelectTeam />
          </Navbar.Start>
          <Navbar.End>
            <Menu horizontal className="p-0">
              {user ? (
                <>
                  <Form method="post" action="/logout">
                    <AuthenticityTokenInput />
                    <Menu.Item>
                      <Button type="submit" color="ghost">
                        Logout
                      </Button>
                    </Menu.Item>
                  </Form>
                </>
              ) : (
                <Menu.Item>
                  <Link to="/login">Login</Link>
                </Menu.Item>
              )}
            </Menu>
          </Navbar.End>
        </Navbar>
        <div className="container mx-auto p-2 mt-6">
          <Outlet />
        </div>
      </Drawer>
    </>
  );
};

export const Sidebar = ({
  isLogged,
  onClose,
}: {
  isLogged: boolean;
  onClose: () => void;
}) => {
  if (!isLogged) {
    return null;
  }
  return (
    <>
      <Menu className="bg-base-100/90">
        <Menu.Title>
          <Link to="/" prefetch="intent">
            Bellz
          </Link>
        </Menu.Title>
        <Menu.Item>
          <NavLink to="/" prefetch="intent" end>
            Dashboard
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/accounts" prefetch="intent">
            Accounts
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/loans" prefetch="intent">
            Loans
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/subscriptions" prefetch="intent">
            Subscriptions & Incomes
          </NavLink>
        </Menu.Item>
        <Menu.Title>
          <Link to="/converter" prefetch="intent">
            Tools
          </Link>
        </Menu.Title>
        <Menu.Item>
          <NavLink to="/converter" prefetch="intent">
            Converter
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/teams" prefetch="intent">
            Teams
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/profile" prefetch="intent">
            Profile
          </NavLink>
        </Menu.Item>

        <Menu.Item className="lg:hidden">
          <Button color="ghost" onClick={onClose}>
            Close
          </Button>
        </Menu.Item>

        <div className="flex-1"></div>
        <Form method="post" action="/logout">
          <Menu.Item>
            <Button type="submit" color="ghost">
              Logout
            </Button>
          </Menu.Item>
        </Form>
      </Menu>
    </>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const user = await ensureUser(request);
  await ensureCsrf(request);
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const formData = await request.formData();
  const { teamId } = zod
    .object({
      teamId: zod.string(),
    })
    .parse(Object.fromEntries(formData.entries()));

  const teamController = new TeamController();

  const teams = await teamController.getTeamsForUser(user.id);

  if (!teams.map(prop("id")).includes(teamId)) {
    throw badRequest({ message: "Team not found" });
  }

  session.set("teamId", teamId);

  return json(
    {
      teamId,
    },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
};

export const ErrorBoundary = ErrorHandler;

export default App;
