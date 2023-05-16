import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Button, Menu, Navbar } from "react-daisyui";

import { ButtonLink } from "~/components/ButtonLink";

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
        <div className="flex-1">
          <ButtonLink color="ghost" to="/">
            Bellz
          </ButtonLink>
        </div>
        <div className="flex-none">
          <Menu horizontal className="p-0">
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
                    Subscriptions
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
