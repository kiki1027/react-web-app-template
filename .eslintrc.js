module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'airbnb', // Uses airbnb, it including the react rule(eslint-plugin-react/eslint-plugin-jsx-a11y)
    // 'plugin:@typescript-eslint/recommended', // Optional enable, will more stricter
    'plugin:import/typescript', // Use prettier/react to pretty react syntax
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
    // 'prettier/@typescript-eslint'
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // use <root>/path/to/folder/tsconfig.json
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  env: {
    browser: true, // enable all browser global variables
    jest: true,
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'promise', 'prettier'],
  rules: {
    // 与 airbnb 配置冲突
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    'no-useless-constructor': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'react/jsx-one-expression-per-line': 0,
    'react-hooks/rules-of-hooks': 'error',
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 1,
    // react 17之后无需手动在 jsx 中 import React
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'promise/always-return': 0,
    'promise/catch-or-return': 0,
    'no-use-before-define': 0,
    'import/prefer-default-export': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,

    /**
     * @description rules of @typescript-eslint
     */
    '@typescript-eslint/prefer-interface': 0, // also want to use 'type'
    '@typescript-eslint/explicit-function-return-type': 0, // annoying to force return type
    '@typescript-eslint/indent': 0, // avoid conflict with airbnb
    '@typescript-eslint/no-use-before-define': [2],

    /**
     * @description rules of eslint-plugin-prettier
     */
    // 'prettier/prettier': [
    //   error,
    //   {
    //     singleQuote: true,
    //     semi: false,
    //   },
    // ],
  },
};
