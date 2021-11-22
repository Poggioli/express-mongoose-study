import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'

const handleError = (resp: Response, err: any) => {
  let statusCode!: number
  let messages: any
  if (err.name === 'ValidationError') {
    messages = []
    Object.keys(err.errors).forEach((key) => {
      messages.push(err.errors[key].message)
    })
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY
  }
  resp
    .status(statusCode || err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(messages || err.message)
}

export default handleError
