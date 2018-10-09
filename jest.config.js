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
  testURL: 'http://localhost/',
  coverageThreshold: {
    global: {
      branches: 11,
      functions: 15,
      lines: 15,
      statements: 15,
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
    '\\.(css|scss|svg)$': '<rootDir>/tests/jest/config/styleMock.js'
  }
}

jestConfig.reporters = process.env.TRAVIS ? [ 'default', tapReporter ] : [ 'default']

module.exports = jestConfig
