import { test, expect } from "playwright-test-coverage";

test("Ordering", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = {
      email: "a@jwt.com",
      password: "admin",
    };
    const loginRes = {
      user: {
        id: 1,
        name: "常用名字",
        email: "a@jwt.com",
        roles: [{ role: "admin" }, { role: "diner" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
  await page.route("*/**/api/franchise", async (route) => {
    if (
      route.request().method() == "GET" ||
      route.request().method() == "POST"
    ) {
      const fRes = [
        {
          id: 249,
          name: "aa",
          admins: [
            {
              id: 1,
              name: "常用名字",
              email: "a@jwt.com",
            },
          ],
          stores: [
            {
              id: 138,
              name: "abc1",
              totalRevenue: 0,
            },
          ],
        },
      ];
      await route.fulfill({ json: fRes });
    }

    if (route.request().method() == "DELETE") {
      const fRes = {
        message: "franchise deleted",
      };
      await route.fulfill({ json: fRes });
    }
  });

  await page.route("*/**/api/franchise/*", async (route) => {
    const fRes = [
      {
        id: 249,
        name: "aa",
        admins: [
          {
            id: 1,
            name: "常用名字",
            email: "a@jwt.com",
          },
        ],
        stores: [
          {
            id: 138,
            name: "abc1",
            totalRevenue: 0,
          },
        ],
      },
    ];

    await route.fulfill({ json: fRes });
  });

  await page.route("*/**/api/franchise/**/store", async (route) => {
    const sRes = {
      id: 142,
      franchiseId: 249,
      name: "abc1",
    };

    await route.fulfill({ json: sRes });
  });

  await page.route("*/**/api/order/menu", async (route) => {
    const menRes = [
      {
        id: 1,
        title: "0zq71hieta",
        image: "08ptytamyl.fortnite",
        price: 77.64724841,
        description: "3lhjz9w6e0this is the description",
      },
    ];

    await route.fulfill({ json: menRes });
  });

  await page.route("*/**/api/order", async (route) => {
    const ordRes = {
      order: {
        items: [
          {
            menuId: 1,
            description: "0zq71hieta",
            price: 77.64724841,
          },
        ],
        storeId: "138",
        franchiseId: 249,
        id: 87,
      },
      jwt: "eyJpYXQiOjE3MzkzMTY1OTEsImV4cCI6MTczOTQwMjk5MSwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJhb25zdG90dCIsIm5hbWUiOiJBYXJvbiBPbnN0b3R0In0sImRpbmVyIjp7ImlkIjoxLCJuYW1lIjoi5bi455So5ZCN5a2XIiwiZW1haWwiOiJhQGp3dC5jb20ifSwib3JkZXIiOnsiaXRlbXMiOlt7Im1lbnVJZCI6MSwiZGVzY3JpcHRpb24iOiIwenE3MWhpZXRhIiwicHJpY2UiOjc3LjY0NzI0ODQxfV0sInN0b3JlSWQiOiIxMzciLCJmcmFuY2hpc2VJZCI6MjQ5LCJpZCI6ODd9fQ.Y3CVe8q_yE7Z3AEy3RHACDMTFTQpb5GC0B6SxEUBsDrycER5fG78aso-ZDIE9CWo3yU2pAku-5bALA7pX4AWqoOasHCu1A1DhMGI1Vf1q88YcqctmQSw_6rBQwWOgBf4oWDy7RPwrQTykuq2r9ESbM-hVW74C2YwYb5iJGylaQZwgx1XH7YCM2SfjNDx1mDVur4n3dphs4CfPtCSZWWaS4MOqf2Ew0LtV2c8TpodYkvgQB5TH8fpEDKrvfHB4_U0lsdhYf6PnJsn5yJ-r_ipHhZhFXUMHD5FIHWg53r3urlVjasURjHX2PzBkxezoDSDJiyjO0OEwosszTfk0RWV6yvDNJM3b-fvZ86f6arq6-psvPl282wZurcqww6BnKez53o32T-bea1sqTU6-sSjZiJwJUexd4JtlQcg7GWCMPKsoa0akZrPKB-rIg8bGg3RyV4RXgWODE_lwT0RY9Vtlnu6gFApYHFuZkmzpNwqU1w7C0lFb7n0B0VM4jCBMcFJvpbPmNM0-7hVoxUlTbELOmjoAV1q2WHdTaOR_5EoqYKD9UkrOCAC8SiG3ACi2nAoNHTPrevdjm-OXw7SdVrL1jFu09e1d2Ty9B6tVMfML--mlEJcfuhwfepSQDIx40LTBP1Jty674bE5fuLOvSiC-bL04a2-XYkNjEqAA0BCWqs",
    };

    await route.fulfill({ json: ordRes });
  });

  await page.route("*/**/api/order/verify", async (route) => {
    const verifyRes = {
      message: "valid",
      payload: {
        vendor: {
          id: "aonstott",
          name: "Aaron Onstott",
        },
        diner: {
          id: 1,
          name: "常用名字",
          email: "a@jwt.com",
        },
        order: {
          items: [
            {
              menuId: 1,
              description: "0zq71hieta",
              price: 77.64724841,
            },
          ],
          storeId: "138",
          franchiseId: 249,
          id: 87,
        },
      },
    };

    await route.fulfill({ json: verifyRes });
  });

  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).fill("abc");
  await page.getByRole("textbox", { name: "franchisee admin email" }).click();
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("a@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("link", { name: "home" }).click();
  await page.getByRole("link", { name: "Franchise" }).click();
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("abc1");
  await page.getByRole("button", { name: "Create" }).click();

  await page.getByRole("link", { name: "Order" }).click();
  await page.locator("select").first().selectOption({ index: 1 });

  await page
    .getByRole("link", { name: "Image Description 0zq71hieta" })
    .click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByRole("button", { name: "Pay now" }).click();
  //await page.waitForResponse("**/api/order");
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Verify" }).click();
  //await page.waitForResponse("**/api/order/verify");

  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Close" }).click();
  await page.waitForSelector("text=Admin", { state: "visible" });

  await page.getByRole("link", { name: "Admin" }).click();
  await page
    .getByRole("row", { name: "aa 常用名字 Close" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Close" }).click();
});
