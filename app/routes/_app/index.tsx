import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { json } from "@vercel/remix";
import { not } from "ramda";
import { useState } from "react";
import { Button, Divider, Drawer, Dropdown, Menu, Navbar } from "react-daisyui";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <Navbar className="bg-base-100 shadow-xl">
        <Navbar.Start>
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
        </Navbar.Start>
        <Navbar.End>
          <Menu horizontal className="p-0">
            {user ? (
              <>
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
      <Drawer
        open={isSidebarOpen}
        mobile
        onClickOverlay={() => setIsSidebarOpen(false)}
        side={<Sidebar isLogged={Boolean(user)} />}
        overlayClassName="lg:hidden"
        sideClassName="lg:border-r"
      >
        <div className="container mx-auto p-2 mt-6">
          <Outlet />
        </div>
      </Drawer>
    </>
  );
};

export const Sidebar = ({ isLogged }: { isLogged: boolean }) => {
  if (!isLogged) {
    return null;
  }
  return (
    <>
      <Menu className="bg-base-100/50 ">
        <Menu.Item>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/loans">Loans</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/converter">Converter</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/subscriptions">Subscriptions & Incomes</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/profile">Profile</NavLink>
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

export const action: ActionFunction = async () => {
  return json({});
};

export const ErrorBoundary = ErrorHandler;

export default App;
