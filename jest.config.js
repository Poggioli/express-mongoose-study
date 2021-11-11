/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest/utils')
// eslint-disable-next-line import/extensions
const { compilerOptions } = require('./tsconfig.json')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testTimeout: 10000,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
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
    'environment.ts',
    'tests'
  ],
  coverageReporters: [
    'text',
    'cobertura',
    'html',
    'lcov'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  reporters: [
    'default',
    'jest-junit',
    'jest-html-reporters'
  ],
  testResultsProcessor: 'jest-sonar-reporter',
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
