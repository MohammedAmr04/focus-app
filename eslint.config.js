import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const typescriptFiles = ['**/*.ts'];

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'src/generated/**'],
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: typescriptFiles,
    rules: js.configs.recommended.rules,
  },
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: typescriptFiles,
  })),
  {
    files: typescriptFiles,
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.test.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // Supertest exposes parsed response bodies as `any`.
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  prettier,
);
