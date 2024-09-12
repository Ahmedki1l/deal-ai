/** @type {import('prettier').Config} */

module.exports = {
  endOfLine: "lf",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrder: [
    "^@/styles/(.*)$",
    "^(next/(.*)$)|^(next$)",
    "^(react/(.*)$)|^(react$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/types/(.*)$",
    "",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: [
    "prettier-plugin-organize-imports",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ["cn", "cva"],
};
