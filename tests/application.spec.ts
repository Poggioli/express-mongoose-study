import Application from '../src/application'
import logger from '../src/core/infra/logger'

describe('Server', () => {
  let app: Application
  let spyLogger: jest.SpyInstance

  beforeEach(async () => {
    app = new Application()
    spyLogger = jest.spyOn(logger, 'info')
    await app.bootstrap()
  })

  afterEach(() => {
    app.shutdown()
  })

  it('Should be running', () => {
    expect(app.isRunning()).toBe(true)
  })

  it('Shouldn\'t be running after shutdown', () => {
    app.shutdown()
    expect(app.isRunning()).toBe(false)
  })

  describe('Should call logger.info', () => {
    it('With \'Loading application with port: 3003\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(1, 'Loading application with port: 3003')
    })

    it('With \'Loading application with Environment: test\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(2, 'Loading application with Environment: test')
    })

    it('With \'Configuring Case Sensitive Rounting to: true\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(3, 'Configuring Case Sensitive Rounting to: true')
    })

    it('With \'Configuring CORS with policy: *\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(4, 'Configuring CORS with policy: *')
    })

    it('With \'Configuring Middlewares: BodyParsers\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(5, 'Configuring Middlewares: BodyParsers')
    })

    it('With \'Configuring Middlewares: Helmet\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(6, 'Configuring Middlewares: Helmet')
    })

    it('With \'Configuring Middlewares: Actuator\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(7, 'Configuring Middlewares: Actuator')
    })

    it('With \'Configuring Middlewares: Compression\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(8, 'Configuring Middlewares: Compression')
    })

    it('With \'Configuring Morgan\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(9, 'Configuring Morgan')
    })

    it('With \'graphql-study running on port 3003\'', async () => {
      expect(spyLogger).toHaveBeenNthCalledWith(10, 'graphql-study running on port 3003')
    })

    it('With \'graphql-study running on port 3003\'', async () => {
      expect(spyLogger).toHaveBeenCalledTimes(10)
    })
  })
})
