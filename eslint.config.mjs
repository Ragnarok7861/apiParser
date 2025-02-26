import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: 'latest',
    },
    plugins: {
      prettier,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Отключаем конфликтующие правила ESLint
      'prettier/prettier': 'error', // Показывать ошибки при несоответствии стилю
    },
  },
];
