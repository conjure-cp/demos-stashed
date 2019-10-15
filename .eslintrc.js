module.exports = {
  root: true,

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript',
    '@vue/prettier',
  ],

  rules: {
    // Only allow debugger in development
    'no-debugger': process.env.PRE_COMMIT ? 'error' : 'off',
    // Only allow `console.log` in development
    'no-console': process.env.PRE_COMMIT
      ? [
          'error',
          {
            allow: ['warn', 'error'],
          },
        ]
      : 'off',
  },

  overrides: [
    {
      files: ['src/**/*', 'tests/unit/**/*', 'tests/e2e/**/*'],
      parserOptions: {
        parser: '@typescript-eslint/parser',

        sourceType: 'module',
      },
      env: {
        browser: true,
      },
    },
    {
      files: ['**/*.unit.js'],
      parserOptions: {
        parser: '@typescript-eslint/parser',

        sourceType: 'module',
      },
      env: {
        jest: true,
      },
      globals: {
        mount: false,
        shallowMount: false,
        shallowMountView: false,
        createComponentMocks: false,
        createModuleStore: false,
      },
    },
  ],

  extends: [
    'plugin:vue/recommended',
    'standard',
    'prettier',
    'prettier/standard',
    'prettier/vue',
    '@vue/typescript',
  ],
}
