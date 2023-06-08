import React from "react";
import ReactDOMServer from "react-dom/server";

import EmailLayout from "./components/EmailLayout";

export class EmailRenderer<T> {
  protected subject: string;
  protected text?: React.FunctionComponent<T>;
  protected html?: React.FunctionComponent<T>;

  constructor() {
    this.subject = "";
  }

  protected verifyParams(params: T | null) {
    return params;
  }

  render(props: T | null = null) {
    const params = this.verifyParams(props);

    const text =
      this.text &&
      ReactDOMServer.renderToStaticMarkup(
        // @ts-ignore
        React.createElement(this.text, params)
      );

    const html =
      this.html &&
      ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          EmailLayout,
          // @ts-ignore
          { ...params, title: this.subject },
          // @ts-ignore
          React.createElement(this.html, params)
        )
      );

    return {
      subject: this.subject,
      text: text || "",
      html: html || "",
    };
  }
}
