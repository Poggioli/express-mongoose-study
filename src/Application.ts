import logger from '@infra/logger'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import actuator from 'express-actuator'
import compression from 'compression'
import morgan from 'morgan'
import environment from './environment'

interface ServerException extends Error {
  errno?: string;
  code?: string;
  port?: number;
}

class Server {
  private readonly CORS_POLICY = '*'

  private readonly IS_CASE_SENSITIVE_ROUTING = true

  private app: express.Express

  constructor() {
    this.app = express()
  }

  public bootstrap(): Promise<Server> {
    return this.configPort()
      .then(() => this.configEnvironment())
      .then(() => this.configMiddlewares())
      .then(() => this.configMorgan())
      .then(() => this.listening())
  }

  private listening(): Promise<any> {
    return new Promise((resolve) => {
      const { port } = environment.app
      this.app.listen(port, () => {
        const bootstrapMsg = `${environment.app.name} running on port ${port}`
        logger.info(bootstrapMsg)
      }).on('error', (err: ServerException) => {
        logger.info(err.message)
        process.exit(1)
      })
      resolve(this.app)
    })
  }

  private configPort(): Promise<any> {
    return new Promise((resolve) => {
      const { port } = environment.app
      logger.info(`Loading application with port: ${port}`)
      this.app.set('port', port)
      resolve(this.app)
    })
  }

  private configEnvironment(): Promise<any> {
    return new Promise((resolve) => {
      const { node } = environment
      logger.info(`Loading application with Environment: ${node}`)
      this.app.set('env', node)
      resolve(this.app)
    })
  }

  private configMiddlewares(): Promise<any> {
    return new Promise((resolve) => {
      logger.info(`Configuring Case Sensitive Rounting to: ${this.IS_CASE_SENSITIVE_ROUTING}`)
      this.app.set('case sensitive routing', this.IS_CASE_SENSITIVE_ROUTING)

      logger.info(`Configuring CORS with policy: ${this.CORS_POLICY}`)
      this.app.use(cors({ origin: this.CORS_POLICY }))

      logger.info('Configuring Middlewares: BodyParsers')
      this.app.use(express.urlencoded({ extended: false }))
      this.app.use(express.json())

      logger.info('Configuring Middlewares: Helmet')
      this.app.use(helmet())

      logger.info('Configuring Middlewares: Actuator')
      this.app.use(actuator())

      logger.info('Configuring Middlewares: Compression')
      this.app.use(compression())

      resolve(this.app)
    })
  }

  private configMorgan(): Promise<any> {
    return new Promise((resolve) => {
      this.app.use(morgan(
        '{"date": ":date[clf]", "method": ":method", "url": ":url", "status": ":status"}',
        { stream: { write: (msg: string) => { logger.info(msg) } } }
      ))
      resolve(this.app)
    })
  }
}

export default Server
