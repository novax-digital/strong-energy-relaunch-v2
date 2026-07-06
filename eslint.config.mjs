import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      ".cache/**",
      "old-site/**",
      "public/**",
      "playwright-report/**",
      "test-results/**"
    ]
  }
];

export default eslintConfig;
