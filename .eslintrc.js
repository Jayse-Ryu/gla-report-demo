module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  ignorePatterns: ['src/i18n/index.js'], // because of bug in babel eslint, need to remove when fixed
  rules: {
    'import/no-cycle': ['error', { maxDepth: 1 }],
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/html-self-closing': ['warn', {
      html: { normal: 'never', void: 'always' },
    }],
    'no-shadow': ['error', { allow: ['state'] }],
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    'vue/valid-v-slot': 'off',
    'vue/no-mutating-props': 'warn',
  },
};
