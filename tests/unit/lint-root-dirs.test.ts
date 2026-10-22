import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "vitest";

const require = createRequire(import.meta.url);
const { getRootDirs } = require("@next/eslint-plugin-next/dist/utils/get-root-dirs.js");

// The scoped Node glob adapter must preserve Next's actual API
// usage, including brace patterns, directory filtering, and multiple roots.
test("Next lint root discovery works with the replacement glob implementation", () => {
  const cwd = process.cwd();
  assert.deepEqual(getRootDirs({ cwd, settings: {} }), [cwd]);
  assert.deepEqual(
    getRootDirs({ cwd, settings: { next: { rootDir: "src/{app,components}" } } }).sort(),
    ["src/app", "src/components"],
  );
  assert.deepEqual(
    getRootDirs({ cwd, settings: { next: { rootDir: ["src/lib", "package.json"] } } }),
    ["src/lib"],
  );
  assert.deepEqual(
    getRootDirs({ cwd, settings: { next: { rootDir: cwd } } }),
    [cwd],
  );
});
