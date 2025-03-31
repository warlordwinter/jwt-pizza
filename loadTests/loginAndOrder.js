import { sleep, check } from "k6";
import http from "k6/http";
import jsonpath from "https://jslib.k6.io/jsonpath/1.0.2/index.js";

export const options = {
  cloud: {
    distribution: {
      "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
    },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: "ramping-vus",
      gracefulStop: "30s",
      stages: [
        { target: 5, duration: "30s" },
        { target: 15, duration: "1m" },
        { target: 10, duration: "30s" },
        { target: 0, duration: "30s" },
      ],
      gracefulRampDown: "30s",
      exec: "scenario_1",
    },
  },
};

export function scenario_1() {
  let response;

  const vars = {};

  // Login
  response = http.put(
    "https://pizza-service.pdfsimplifer.click/api/auth",
    '{"email":"a@jwt.com","password":"admin"}',
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    }
  );
  check(response, {
    "status equals 200": (response) => response.status.toString() === "200",
  });

  vars["token"] = jsonpath.query(response.json(), "$.token")[0];

  response = http.options(
    "https://pizza-service.pdfsimplifer.click/api/auth",
    null,
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "access-control-request-headers": "content-type",
        "access-control-request-method": "PUT",
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    }
  );
  sleep(3.4);

  response = http.get(
    "https://pizza-service.pdfsimplifer.click/api/order/menu",
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${vars["token"]}`,
        "content-type": "application/json",
        "if-none-match": 'W/"1fc-cgG/aqJmHhElGCplQPSmgl2Gwk0"',
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    }
  );

  response = http.options(
    "https://pizza-service.pdfsimplifer.click/api/order/menu",
    null,
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "access-control-request-headers": "authorization,content-type",
        "access-control-request-method": "GET",
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    }
  );

  response = http.get(
    "https://pizza-service.pdfsimplifer.click/api/franchise",
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${vars["token"]}`,
        "content-type": "application/json",
        "if-none-match": 'W/"96-Vkk9VNZeh6O+EaavEYrdgaSCuxo"',
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    }
  );

  response = http.options(
    "https://pizza-service.pdfsimplifer.click/api/franchise",
    null,
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "access-control-request-headers": "authorization,content-type",
        "access-control-request-method": "GET",
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    }
  );
  sleep(8.8);

  response = http.post(
    "https://pizza-service.pdfsimplifer.click/api/order",
    '{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":1}',
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${vars["token"]}`,
        "content-type": "application/json",
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    }
  );

  response = http.options(
    "https://pizza-service.pdfsimplifer.click/api/order",
    null,
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "access-control-request-headers": "authorization,content-type",
        "access-control-request-method": "POST",
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    }
  );
  sleep(2.5);

  response = http.post(
    "https://pizza-factory.cs329.click/api/order/verify",
    '{"jwt":"eyJpYXQiOjE3NDM0NTYxMjcsImV4cCI6MTc0MzU0MjUyNywiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJ3anczNyIsIm5hbWUiOiJXaWxleSBXZWxjaCJ9LCJkaW5lciI6eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIn0sIm9yZGVyIjp7Iml0ZW1zIjpbeyJtZW51SWQiOjEsImRlc2NyaXB0aW9uIjoiVmVnZ2llIiwicHJpY2UiOjAuMDAzOH1dLCJzdG9yZUlkIjoiMSIsImZyYW5jaGlzZUlkIjoxLCJpZCI6OTl9fQ.VJpYEKSkE_Z5xOsJ8xUkMrpV0kYWZIRHY9mCoY85wuC89B6cWJvPIAqqInCjT_uGPzS65QVXKvTxrPyamDEFX-IzDovIq9czsf8NQ5A-vBA5So5SICOkVGl8VpEZ0BjRrhZah2TG4XCcaLMVuev4ma5NUp-G5WkfvgPvcg_vHKUhaPA411LDMYqGT4Fk6qnBat4ocKnn63ls0IfH8mKy8WDlw1WGVlBpGpFFg9C2gfR8oEOo1WwJ__yHfCGppPeY9Ubzg764pYAutEsjZAMy9HzLEaF1GuM8k3gPBVoCLkrZ51rEP0mjKnbGCluscckpMzwkz0CfYzyc0Jaa8-pvDv295e3XZkRExNlGHUX5-Pd3x_hb0WCXPXozyzUFboYdYga2eXaBbJQ2IOGvb2zbQNMkxjT6m57VxNZa86n5E-73biPEA-iR9xaiZtb8UR_Y3yrHT4AdE2-v0Z7EiyUyGf0GUAR4xsSTlr_lGHWh7GQkNMw9lP1j4_4I8GQOuOKfWg2zygBTHw7_gaC7USbFTxz-nqHeilOEZVmoTliwf9MsGO5jl4iePVrgFnEIbhKAIz-CPdOjjjdmwQkVl96v2yohjjJ2b1OBltL43GKuLJwDXaX2uY2vwJRL9-vlEwcpCCpjeu_KwfcceOH4NfGbF4LhBTphSCcMEEwuVgvoKJo"}',
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${vars["token"]}`,
        "content-type": "application/json",
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "sec-fetch-storage-access": "active",
      },
    }
  );

  response = http.options(
    "https://pizza-factory.cs329.click/api/order/verify",
    null,
    {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "access-control-request-headers": "authorization,content-type",
        "access-control-request-method": "POST",
        origin: "https://pizza.pdfsimplifer.click",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
      },
    }
  );
}
