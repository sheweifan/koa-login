module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "no-unused-vars": 0,
    "max-len": [1, 120, 2, {ignoreComments: true}],
    "prop-types": 0,//[2]
    "no-underscore-dangle": 0
  },
  globals: {}
}
