/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
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
    '!**/src-web/index.js',
    '!**/src-web/components/TemplateEditor/**'
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
  testResultsProcessor: 'jest-sonar-reporter',
  testURL: 'http://localhost/',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 55,
      lines: 60,
      statements: 60
    }
  },
  testMatch: [
    '<rootDir>/tests/jest/**/*.test.js?(x)',
    '<rootDir>/tests/jest/**/**/*.test.js?(x)',
    '<rootDir>/tests/jest/**/**/**/*.test.js?(x)',
    '**/tests/jest/**/*.test.js',
    '**/src-web/**/*.test.js'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.+\\.(hbs)$': 'jest-handlebars',
    '.+\\.(handlebars)$': 'jest-handlebars',
    '.+\\.(yaml)$': 'jest-yaml-transform'
  },
  transformIgnorePatterns: ['/node_modules/(?!monaco-editor).+\\.js$'],
  globalSetup: '<rootDir>/tests/jest/config/properties-to-json.js',
  setupFiles: ['<rootDir>/tests/jest/config/setup.js'],
  moduleNameMapper: {
    '\\.(css|scss|svg|png)$': '<rootDir>/tests/jest/config/styleMock.js'
  }
}

jestConfig.reporters = process.env.TRAVIS
  ? ['default', tapReporter]
  : ['default']

module.exports = jestConfig
