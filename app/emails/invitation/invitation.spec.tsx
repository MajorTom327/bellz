import { describe, expect, it } from "vitest";

import InvitationEmail from ".";

// Abstract test to render react as email
describe("Render the invitation email", () => {
  it("should render the invitation email", () => {
    const invitationEmail = new InvitationEmail();

    const result = invitationEmail.render({
      acceptLink: "https://example.com",
    });

    expect(result).hasOwnProperty("subject");
    expect(result).hasOwnProperty("text");
    expect(result).hasOwnProperty("html");
    expect(result.html).include("<h1>");

    expect(result.html).include("<html");
    expect(result.html).include("<head");
    expect(result.html).include(`<title>`);
    expect(result.html).include("<body");
    expect(result.html).include("</html>");

    expect(result.html).include('<a href="https://example.com">');
    expect(result.text).include("https://example.com");

    console.log("result", JSON.stringify(result, null, 2));

    expect(true).toBe(true);
  });
});
