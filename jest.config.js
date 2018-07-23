/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
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
    'src-web/**/*.{js,jsx}'
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
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 18,
      lines: 20,
      statements: 20,
    },
  },
  testMatch: [
    '<rootDir>/tests/jest/*/*.test.js?(x)',
    '<rootDir>/tests/jest/*/*/*.test.js?(x)'
  ],
  globalSetup: '<rootDir>/tests/jest/config/properties-to-json.js',
  setupFiles: [
    '<rootDir>/tests/jest/config/setup.js'
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/tests/jest/config/styleMock.js'
  }
}

jestConfig.reporters = process.env.TRAVIS ? [ 'default', tapReporter ] : [ 'default']

module.exports = jestConfig
