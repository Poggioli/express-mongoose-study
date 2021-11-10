/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testTimeout: 10000,
  modulePathIgnorePatterns: [
    'node_modules',
    'dist',
    'coverage',
    'docker',
    'logs'
  ],
  moduleDirectories: [
    '<rootDir>/src',
    'node_modules'
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'coverage',
    'docker',
    'logs',
    'swagger*',
    'application.ts',
    'environment.ts',
    'tests'
  ],
  coverageReporters: [
    'text',
    'cobertura',
    'html',
    'lcov'
  ],
  reporters: [
    'default',
    'jest-junit',
    'jest-html-reporters'
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  globals: {
    address: 'http://localhost:3012'
  },
  testMatch: [
    '**/tests/**/*.(test|spec).+(ts)'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ]
}
