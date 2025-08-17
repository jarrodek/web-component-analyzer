import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/**
 * List of files that must be ignored globally
 */
export const GLOBAL_IGNORE_LIST = [
  '.github/',
  '.husky/',
  '.vscode/',
  'coverage/',
  'dev/',
  'lib/',
  'node_modules',
  'scripts/',
  '*.min.*',
  '*.d.ts',
  'CHANGELOG.md',
  'LICENSE*',
  'package-lock.json',
]

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...Object.keys(globals.browser).filter(
          // Disallow Node-specific globals (unless they are shared)
          (g) => !Object.prototype.hasOwnProperty.call(globals.node, g)
        ),
      ],
      'max-len': [
        'error',
        {
          code: 120,
          comments: 120,
          ignoreUrls: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'no-unreachable': ['error'],
      'no-multi-spaces': ['error'],
      'no-console': ['error'],
      'no-redeclare': ['error'],
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node, // Enable Node.js globals for these files
      },
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...Object.keys(globals.browser).filter(
          // Disallow Node-specific globals (unless they are shared)
          (g) => !Object.prototype.hasOwnProperty.call(globals.node, g)
        ),
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'no-console': ['warn'],
    },
  },
  {
    ignores: GLOBAL_IGNORE_LIST,
  },
]
