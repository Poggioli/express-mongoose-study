import config from 'config'
// @ts-ignore
// eslint-disable-next-line import/extensions
import * as pkg from '../package.json'

const environment = {
  node: process.env.NODE_ENV || 'dev',
  app: {
    port: config.get('app.port'),
    name: pkg.name
  },
  log: {
    level: config.get('log.level'),
    output: config.get('log.output'),
    fileName: config.get('log.fileName'),
    maxFileSize: config.get('log.maxFileSize'),
    maxFiles: config.get('log.maxFiles')
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || config.get('auth.jwtSecret')
  },
  db: {
    useAuth: config.get('db.useAuth'),
    url: process.env.URL_DB || config.get('db.url'),
    username: process.env.USERNAME_DB || config.get('db.username'),
    password: process.env.PASSWORD_DB || config.get('db.password')
  },
  security: {
    roundSalts: config.get('security.roundSalts')
  }
}

export default environment
