import logger from '@infra/logger'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import actuator from 'express-actuator'
import helmet from 'helmet'
import { Server } from 'http'
import mongoose from 'mongoose'
import morgan from 'morgan'
import environment from './environment'

class Application {
  private readonly CORS_POLICY = '*'

  private readonly IS_CASE_SENSITIVE_ROUTING = true

  private _app: express.Express

  constructor() {
    this._app = express()
  }

  public async bootstrap(): Promise<Server> {
    return this.initDatabase()
      .then(() => this.configPort())
      .then(() => this.configEnvironment())
      .then(() => this.configMiddlewares())
      .then(() => this.configMorgan())
      .then(() => this.listening())
  }

  private listening(): Server {
    const { port } = environment.app
    return this._app.listen(port)
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

  private getUrlDatabase(): string {
    const {
      url, username, password, useAuth
    } = environment.db
    let finalUrl: string = url as string
    if (useAuth) {
      finalUrl = finalUrl.replace(/{username}/, username as string).replace(/{password}/, password as string)
    }
    return finalUrl
  }

  private initDatabase(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        logger.info('Connecting to database')
        mongoose.connect(this.getUrlDatabase())
          .then(() => {
            logger.info('Connected to database')
            resolve(this._app)
          }, (err) => {
            logger.error(`Error to connect to database: ${err}`)
            reject(err)
          })
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default Application