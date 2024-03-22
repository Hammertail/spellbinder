import { test } from "node:test";
import { equal } from "node:assert";

import { add } from ".";

test("add", () => {
  equal(add(1, 2), 3);
  equal(add(0, 0), 0);
  equal(add(-1, 1), 0);
  equal(add(-1, -1), -2);
  equal(add(1, -1), 0);
});
