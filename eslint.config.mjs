import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default [
    js.configs.recommended,
    {
        ignores: [
            "**/*.spec.ts",
            ".angular/**",
            ".github/**",
            "dist/**",
            "e2e/**",
            "node_modules/**",
            "src/assets/**",
            "tailwind.config.js",
            "eslint.config.mjs",
            "ng-tailwind-config.js"
        ]
    },
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parser: tsparser,
            parserOptions: {
                project: "./tsconfig.json",
            },
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly",
                process: "readonly",
                require: "readonly",
                module: "readonly",
                __dirname: "readonly",
            },
        },

        plugins: {
            "@typescript-eslint": tseslint,
            "import": importPlugin,
            "unused-imports": unusedImports,
        },

        rules: {
            "@angular-eslint/use-pipe-transform-interface": "off",
            "@typescript-eslint/consistent-type-definitions": "error",
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/member-ordering": "error",
            "@typescript-eslint/no-empty-interface": "error",
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/no-unused-expressions": "error",
            "@typescript-eslint/no-use-before-define": "error",
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/unified-signatures": "error",
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                { "accessibility": "explicit" }
            ],

            "unused-imports/no-unused-imports": "error",
            "import/no-duplicates": "error",
            "import/no-unresolved": "off",
            "import/order": [
                "error",
                {
                    "warnOnUnassignedImports": true,
                    "alphabetize": { order: 'ignore', orderImportKind: 'asc', caseInsensitive: true },
                    "groups": ["external", "builtin", ["parent", "sibling"], "index", "internal"]
                }
            ],

            "arrow-body-style": "error",
            "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
            "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0, "maxBOF": 0 }],
            "no-bitwise": "error",
            "no-unneeded-ternary": ["error", { "defaultAssignment": true }],
            "padded-blocks": ["error", "never"],
            "brace-style": ["error", "1tbs"],
            "curly": "error",
            "eol-last": "error",
            "guard-for-in": "error",
            "object-curly-newline": [
                "error",
                { "ImportDeclaration": { "multiline": true, "minProperties": 8 }, "ExportDeclaration": { "multiline": true, "minProperties": 8 } }
            ],
            "padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: ["const", "let", "var", "for", "while", "do", "if", "switch", "try"], next: "*" },
                { blankLine: "always", prev: ["*"], next: ["const", "let", "var", "for", "while", "do", "if", "switch", "try", "return"] },
                { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
            ],
            "no-console": [
                "error",
                {
                    "allow": ["log", "warn", "dir", "timeLog", "assert", "clear", "count", "countReset", "group", "groupEnd", "table", "error"]
                }
            ],

            "semi": ["error", "always"],
            "no-debugger": "error",
            "no-eval": "error",
            "no-new-wrappers": "error",
            "no-throw-literal": "error",
            "no-trailing-spaces": "error",
            "no-undef-init": "error",
            "no-unused-labels": "error",
            "no-var": "error",
            "prefer-const": "off",
            "no-unused-vars": "off",
            "no-undef": "off",
            "no-async-promise-executor": "off",
            "no-useless-escape": "off",
            "no-prototype-builtins": "off",
            "no-case-declarations": "off",
            "no-unsafe-optional-chaining": "off"
        }
    }
];
