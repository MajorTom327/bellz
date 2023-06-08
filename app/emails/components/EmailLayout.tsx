import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const EmailLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>{title}</title>
        </head>
        <body>{children}</body>
      </html>
    </>
  );
};

EmailLayout.defaultProps = {};

export default EmailLayout;
