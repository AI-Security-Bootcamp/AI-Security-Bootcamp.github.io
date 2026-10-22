import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // GitHub Pages uses document navigation; this also preserves the current
      // page-load analytics identity and experiment assignment semantics.
      "@next/next/no-html-link-for-pages": "off",
      // Existing theme/countdown hydration guards deliberately set mount state.
      // Surface the new React rule without turning a security update into a UI refactor.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
