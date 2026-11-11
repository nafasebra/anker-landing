import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".npm-cache/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated starter validators; current route types live under .next/types.
    "types/**",
  ]),
]);

export default eslintConfig;
