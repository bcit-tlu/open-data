import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { react },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/jsx-no-target-blank': 'error',
    },
  },
  {
    ignores: [
      'build/',
      '.docusaurus/',
      'node_modules/',
      '**/*.js',
      '**/*.mjs',
    ],
  },
);
