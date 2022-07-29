import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

let ErrorCount = new Counter("errors");

export const options = {
  vus: 10,
  duration: "60s",
  thresholds: {
    errors: ["count<10"]
  }
};

export default function () {

  const path = Math.random() < 0.8 ? "200" : "500";

  let res = http.get(`https://httpbin.test.k6.io/status/${path}`);
  let success = check(res, {
    "status is 200": r => r.status === 200
  });
  if (!success) {
    ErrorCount.add(1);
  }

  sleep(1);
}
