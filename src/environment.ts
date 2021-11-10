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
  }
}

export default environment
