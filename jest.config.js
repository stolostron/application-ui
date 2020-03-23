/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * (c) Copyright 2020 Red Hat, Inc.
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
    '!**/tmp/**',
    '!**/src-web/components/Topology/viewer/ChannelControl.js',
    '!**/src-web/components/Topology/viewer/RefreshTimeSelect.js',
    '!**/src-web/components/Topology/viewer/ResourceFilterModule.js',
    '!**/src-web/components/Topology/viewer/SearchName.js',
    '!**/src-web/components/Topology/viewer/TypeFilterBar.js',
    '!**/src-web/components/Topology/viewer/defaults/index.js',
    '!**/src-web/components/Topology/viewer/defaults/shapes.js',
    '!**/src-web/components/Topology/viewer/defaults/titles.js',
    '!**/src-web/components/Topology/viewer/constants.js',
    '!**/src-web/components/Topology/index.js',
    '!**/src-web/components/ApplicationTopologyModule/index.js',
    '!**/src-web/components/Topology/viewer/layouts/policy.js',
    '!**/src-web/components/Topology/viewer/layouts/application.js',
    '!**/src-web/components/Topology/viewer/layouts/auto.js',
    '!**/src-web/components/Topology/viewer/layouts/index.js'
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
