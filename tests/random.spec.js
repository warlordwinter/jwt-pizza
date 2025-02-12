import { test, expect } from "playwright-test-coverage";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await page.getByRole("link", { name: "home" }).click();
  await page.getByRole("link", { name: "About" }).click();
  await page.getByRole("link", { name: "History" }).click();
});
