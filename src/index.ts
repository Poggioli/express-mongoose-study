import logger from '@infra/logger'
import Application from '@src/application'
import { Server } from 'http'
import { AddressInfo } from 'net'

const server = new Application()
server
  .bootstrap()
  .then((app) => app.listening())
  .then((_server: Server) => {
    logger.info(`running on ${(_server.address() as AddressInfo).address}:${(_server.address() as AddressInfo).port}`)
  })
  .catch(() => {
    logger.error('Server failed to start')
    process.exit(1)
  })
