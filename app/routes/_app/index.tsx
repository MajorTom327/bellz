import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { json } from "@vercel/remix";
import { Button, Divider, Dropdown, Menu, Navbar } from "react-daisyui";
import { FaBars } from "react-icons/fa";

import { ButtonLink } from "~/components/ButtonLink";
import ErrorHandler from "~/components/ErrorHandler";

import { useOptionalUser } from "~/hooks/useUser";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const App = () => {
  const user = useOptionalUser();

  return (
    <>
      <Navbar className="bg-base-100 shadow-xl mb-6">
        <Navbar.Start>
          <ButtonLink color="ghost" to="/">
            Bellz
          </ButtonLink>
        </Navbar.Start>
        <Navbar.End>
          <Dropdown end>
            <Button tabIndex={0} color="ghost" className="lg:hidden">
              <FaBars />
            </Button>
            <Dropdown.Menu tabIndex={0}>
              {user ? (
                <>
                  <Link to="/converter" color="ghost" prefetch="none">
                    <Dropdown.Item>Converter</Dropdown.Item>
                  </Link>
                  <Link to="/subscriptions" color="ghost" prefetch="none">
                    <Dropdown.Item>Subscriptions & Incomes</Dropdown.Item>
                  </Link>
                  <Link to="/profile" color="ghost" prefetch="none">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </Link>
                  <Divider />
                  <Form method="post" action="/logout">
                    <Button type="submit" wide color="ghost">
                      Logout
                    </Button>
                  </Form>
                </>
              ) : (
                <Dropdown.Item>
                  <Link to="/login">Login</Link>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <Menu horizontal className="p-0 hidden lg:flex">
            {user ? (
              <>
                {/* Hack: Visual Square for the first item */}
                <Menu.Item></Menu.Item>
                <Menu.Item>
                  <ButtonLink to="/converter" color="ghost" prefetch="none">
                    Converter
                  </ButtonLink>
                </Menu.Item>
                <Menu.Item>
                  <ButtonLink to="/subscriptions" color="ghost" prefetch="none">
                    Subscriptions & Incomes
                  </ButtonLink>
                </Menu.Item>
                <Menu.Item>
                  <ButtonLink to="/profile" color="ghost" prefetch="none">
                    Profile
                  </ButtonLink>
                </Menu.Item>
                <Form method="post" action="/logout">
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
      <div className="container mx-auto p-2">
        <Outlet />
      </div>
    </>
  );
};

export const action: ActionFunction = async () => {
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default App;
