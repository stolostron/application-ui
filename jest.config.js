/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const tapReporter = [
  'jest-tap-reporter',
  {
    logLevel: 'ERROR',
    showInternalStackTraces: true,
    filePath: 'test-output/jestTestLogs.tap'
  }
]

const jestConfig = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src-web/**/*.{js,jsx}',
    '**/src-web/**/*.{js}',
    '!**/src-web/root.js',
    '!**/src-web/app.js',
    '!**/src-web/providers/*.*',
    '!**/src-web/pages/routes/*',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/tmp/**'
  ],
  coverageDirectory: './test-output/coverage',
  coverageReporters: [
    'json-summary',
    'json',
    'html',
    'lcov',
    'text',
    'text-summary'
  ],
  testURL: 'http://localhost/',
  coverageThreshold: {
    // TODO - increase threshold once repo is finalized
    global: {
      branches: 25,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  testMatch: [
    '<rootDir>/tests/jest/**/*.test.js?(x)',
    '<rootDir>/tests/jest/**/**/*.test.js?(x)',
    '<rootDir>/tests/jest/**/**/**/*.test.js?(x)',
    '**/tests/jest/**/*.test.js',
    '**/src-web/**/*.test.js'
  ],
  globalSetup: '<rootDir>/tests/jest/config/properties-to-json.js',
  setupFiles: ['<rootDir>/tests/jest/config/setup.js'],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': '<rootDir>/tests/jest/config/styleMock.js'
  }
}

jestConfig.reporters = process.env.TRAVIS
  ? ['default', tapReporter]
  : ['default']

module.exports = jestConfig
