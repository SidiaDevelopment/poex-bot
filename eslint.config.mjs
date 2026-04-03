import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ["**/*.d.ts", "**/*.js"],
    },
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
    {
        files: ["**/*.ts"],

        plugins: {
            "@typescript-eslint": typescriptEslint,
        },
        languageOptions: {
            globals: {},
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            indent: ["error", 4],
            quotes: ["error", "double"],
            semi: ["error", "never"],
            "no-prototype-builtins": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
            }],
        },
    },
];
