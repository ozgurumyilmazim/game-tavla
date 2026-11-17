import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

/** Import boundaries from CODING_RULES.md section 3. Dependencies point inward toward `engine`. */
function boundary(files, forbidden, message) {
  return {
    files,
    rules: {
      'no-restricted-imports': ['error', { patterns: [{ group: forbidden, message }] }],
    },
  };
}

export default tseslint.config(
  { ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ['*.mjs', 'vitest.config.mjs'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': true, 'ts-expect-error': 'allow-with-description' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'No default exports (CODING_RULES.md section 5). Use a named export.',
        },
      ],
    },
  },
  boundary(
    ['packages/engine/**/*.ts'],
    ['@tavla/*', 'node:*', 'fs', 'path', 'http', 'https', 'net', 'crypto'],
    'engine is pure: it may not import other packages or Node APIs.',
  ),
  boundary(
    ['packages/protocol/**/*.ts'],
    ['@tavla/server', '@tavla/client'],
    'protocol may import engine types only.',
  ),
  boundary(['apps/server/**/*.ts'], ['@tavla/client'], 'server must not import client.'),
  boundary(
    ['apps/client/**/*.ts', 'apps/client/**/*.tsx'],
    ['@tavla/server'],
    'client must not import server.',
  ),
  {
    files: ['*.mjs', 'vitest.config.mjs'],
    ...tseslint.configs.disableTypeChecked,
    rules: { ...tseslint.configs.disableTypeChecked.rules, 'no-restricted-syntax': 'off' },
  },
  prettier,
);
