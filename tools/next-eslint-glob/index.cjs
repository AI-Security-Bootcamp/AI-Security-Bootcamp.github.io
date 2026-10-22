const { globSync: nodeGlobSync, statSync } = require("node:fs");

// @next/eslint-plugin-next uses only globSync(pattern, { onlyDirectories: true }).
// Use Node's maintained glob implementation instead of the unpatched braces tree.
exports.globSync = (pattern, options) => {
  if (options?.onlyDirectories !== true || Object.keys(options).length !== 1) {
    throw new Error("Review the Next ESLint glob adapter: unsupported options");
  }
  return nodeGlobSync(pattern).filter((match) => statSync(match).isDirectory());
};
