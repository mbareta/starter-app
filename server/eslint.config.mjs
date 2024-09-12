import tsParser from "@typescript-eslint/parser";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default [{
  ignores: [],
},
...compat.extends('plugin:@typescript-eslint/recommended', 'nestjs'),
{
  plugins: { '@typescript-eslint': tsEslintPlugin, },
  languageOptions: {
    parser: tsParser
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'none' }]
  }
}];
