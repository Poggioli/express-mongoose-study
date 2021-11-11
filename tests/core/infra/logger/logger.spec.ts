import winston from 'winston'

describe('logger', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it(`When process.env NODE_ENV is dev
      Then silent should be false`, () => {
    process.env.NODE_ENV = 'dev'
    jest.spyOn(winston.format, 'printf')
    // eslint-disable-next-line global-require
    const testedModule = require('../../../../src/core/infra/logger')
    expect(testedModule.default.silent).toBe(false)
  })

  it(`When process.env NODE_ENV is test
      Then silent should be true`, () => {
    process.env.NODE_ENV = 'test'
    // eslint-disable-next-line global-require
    const testedModule = require('../../../../src/core/infra/logger')
    expect(testedModule.default.silent).toBe(true)
  })
})
