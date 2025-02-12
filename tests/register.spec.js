import { test, expect } from "playwright-test-coverage";

test("test", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    if (route.request().method() == "POST") {
      const regReq = {
        name: "testman",
        email: "abc@fbi.gov",
        password: "12345",
      };
      const regRes = {
        user: {
          id: 3,
          name: "testman",
          email: "abc@fbi.gov",
          roles: [{ role: "admin" }, { role: "diner" }],
        },
        token: "abcdef",
      };
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(regReq);
      await route.fulfill({ json: regRes });
    } else {
      const logoutRes = {
        message: "logout successful",
      };
      expect(route.request().method()).toBe("DELETE");
      //expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: logoutRes });
    }
  });

  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("testman");
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("abc@fbi.gov");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("12345");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByRole("link", { name: "Logout" }).click();
});
