import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Menu, Navbar } from "react-daisyui";

import { ButtonLink } from "~/components/ButtonLink";

type LoaderData = {};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const App = () => {
  return (
    <>
      <Navbar className="bg-base-100 shadow-xl mb-6">
        <div className="flex-1">
          <ButtonLink color="ghost" to="/">
            Bellz
          </ButtonLink>
        </div>
        <div className="flex-none">
          <Menu horizontal className="p-0">
            <Menu.Item>
              <Link to="/login">Login</Link>
            </Menu.Item>
          </Menu>
        </div>
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

export default App;
