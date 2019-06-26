module.exports = {
  plugins: ['flowtype', 'lodash'],
  extends: ['eslint-config-airbnb', 'plugin:jsx-a11y/recommended'],
  settings: {
    // ...so import Component from 'MyComponent' does not error.
    'import/resolver': {
      'babel-module': {},
    },
  },
  env: {
    jest: true,
    browser: true,
    es6: true,
    node: true,
    commonjs: true,
  },
  parser: 'babel-eslint',
  rules: {
    /* standard */
    curly: 2, // require curly after if, unless one line.
    'max-len': 0, // taken care of by prettier
    'semi-style': 1, // taken care of by prettier
    semi: 1, // taken care of by prettier
    indent: 1, // taken care of by prettier
    'comma-dangle': 1, // taken care of by prettier
    quotes: 1, // taken care of by prettier
    'arrow-body-style': 0, // makes debugging easier
    'no-unused-expressions': 0, // allowing ternary function calls makes calling action methods nicer
    'object-curly-newline': 0, // eslint butchering jsx
    'spaced-comment': [1, 'always', { exceptions: ['*'] }], // comments should have spaces after the slash them, except the block-style comments in the IBM disclaimer.
    /* import */
    'import/first': 0, // don't complain about relative vs absolute path order. not needed bc we are using absolte paths for all/most imports.
    'import/no-unresolved': 1, // make warning
    'import/no-extraneous-dependencies': 0, // fragile + unlikely to catch bugs.
    'import/prefer-default-export': 0, // in a file that's meant to a collection of utility functions, this makes no sense.
    /* jsx-a11y */
    'jsx-a11y/anchor-is-valid': 0, // don't need an href on anchor tags
    /* react */
    'react/no-danger': 0, // dangerouslySetInnerHTML -> there's no need for eslint to warn us about an attribute to with 'dangerous' in the name.
    'react/require-default-props': 0, // shared error
    'react/prop-types': 0, // we're using flow for type checking.
    'react/no-unused-prop-types': 0, // we're using flow for type checking.
    'react/jsx-filename-extension': 0, // we don't use .jsx extension
    /* lodash */
    'lodash/import-scope': [2, 'method'], // makes sure we don't accidentally make our bundle huge by importing lodash globally.
  },
};
