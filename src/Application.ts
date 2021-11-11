import logger from '@infra/logger'
import express from 'express'
import cors from 'cors'
import actuator from 'express-actuator'
import compression from 'compression'
import morgan from 'morgan'
import { Server } from 'http'
import helmet from 'helmet'
import environment from './environment'

class Application {
  private readonly CORS_POLICY = '*'

  private readonly IS_CASE_SENSITIVE_ROUTING = true

  private _app: express.Express

  private _server: Server = new Server()

  private _isRunning: boolean = false

  constructor() {
    this._app = express()
  }

  public bootstrap(): Promise<Application> {
    return this.configPort()
      .then(() => this.configEnvironment())
      .then(() => this.configMiddlewares())
      .then(() => this.configMorgan())
      .then(() => this.listening())
  }

  public shutdown(): void {
    if (this.isRunning()) {
      this._isRunning = false
      logger.info('Server is shutdown')
      this._server.close()
    }
  }

  public isRunning(): boolean {
    return this._isRunning
  }

  private listening(): Promise<any> {
    return new Promise((resolve, reject) => {
      const { port, name } = environment.app
      this._server = this._app.listen(port, () => {
        logger.info(`${name} running on port ${port}`)
        this._isRunning = true
        resolve(this._app)
      }).on('error', (err) => {
        logger.info(err.message)
        this._isRunning = false
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(this)
      })
    })
  }

  private configPort(): Promise<any> {
    return new Promise((resolve) => {
      const { port } = environment.app
      logger.info(`Loading application with port: ${port}`)
      this._app.set('port', port)
      resolve(this._app)
    })
  }

  private configEnvironment(): Promise<any> {
    return new Promise((resolve) => {
      const { node } = environment
      logger.info(`Loading application with Environment: ${node}`)
      this._app.set('env', node)
      resolve(this._app)
    })
  }

  private configMiddlewares(): Promise<any> {
    return new Promise((resolve) => {
      logger.info(`Configuring Case Sensitive Rounting to: ${this.IS_CASE_SENSITIVE_ROUTING}`)
      this._app.set('case sensitive routing', this.IS_CASE_SENSITIVE_ROUTING)

      logger.info(`Configuring CORS with policy: ${this.CORS_POLICY}`)
      this._app.use(cors({ origin: this.CORS_POLICY }))

      logger.info('Configuring Middlewares: BodyParsers')
      this._app.use(express.urlencoded({ extended: false }))
      this._app.use(express.json())

      logger.info('Configuring Middlewares: Helmet')
      this._app.use(helmet())

      logger.info('Configuring Middlewares: Actuator')
      this._app.use(actuator())

      logger.info('Configuring Middlewares: Compression')
      this._app.use(compression())

      resolve(this._app)
    })
  }

  private configMorgan(): Promise<any> {
    return new Promise((resolve) => {
      logger.info('Configuring Morgan')
      this._app.use(morgan(
        '{"date": ":date[clf]", "method": ":method", "url": ":url", "status": ":status"}',
        { stream: { write: (msg: string) => { logger.info(msg) } } }
      ))
      resolve(this._app)
    })
  }
}

export default Application
