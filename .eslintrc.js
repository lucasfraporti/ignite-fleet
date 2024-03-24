module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['@rocketseat/eslint-config/react', 'plugin:react/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    camelcase: 'off',
    'react/display-name': 'off',
  },
}
