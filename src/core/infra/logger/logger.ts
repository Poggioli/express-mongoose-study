import environment from '@src/environment'
import winston from 'winston'

const level = environment.log.level as string
const output = environment.log.output as string
const fileName = environment.log.fileName as string
const maxFileSize = environment.log.maxFileSize as number
const maxFiles = environment.log.maxFiles as number

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level,
      filename: output.concat(fileName).concat(new Date().toTimeString()),
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: maxFileSize,
      maxFiles
    })
  ],
  exitOnError: true
})

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    level: 'debug'
  })
)

export default logger
