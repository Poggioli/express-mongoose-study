import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'

interface ErrorInterface {
  status: number | undefined,
  messages: string | string[] | undefined
}

const errors = (err: any): ErrorInterface => {
  const error = {
    Default(): ErrorInterface {
      return {
        status: err.statusCode,
        messages: err.message
      }
    },
    ValidationError(): ErrorInterface {
      const messages: any = []
      Object.keys(err.errors).forEach((key) => {
        messages.push(err.errors[key].message)
      })
      const statusCode = StatusCodes.UNPROCESSABLE_ENTITY
      return { status: statusCode, messages }
    },
    MongoError(): ErrorInterface {
      if (err.code === 11000) {
        return {
          status: StatusCodes.BAD_REQUEST,
          messages: err.message
        }
      }
      return {
        status: undefined,
        messages: undefined
      }
    }
  }
  const errorToReturn: ErrorInterface = (error as any)[err.name] ? (error as any)[err.name]() : error.Default()
  return errorToReturn
}

const handleError = (resp: Response, err: any) => {
  const error: ErrorInterface = errors(err)
  resp
    .status(error.status || err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(error.messages || err.message)
}

export default handleError
