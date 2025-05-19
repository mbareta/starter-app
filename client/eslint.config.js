import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: [
      '**/*.ts', '**/*.vue'
    ],
    languageOptions: {
      globals: { ...globals.browser }
    },
    rules: {
      'max-len': ['error', { tabWidth: 2 }],
      'sort-imports': ['error', {
        ignoreCase: true,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false
      }],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': ['error', { ignores: ['index'] }],
      'vue/no-v-html': 'off'
    }
  }
]
