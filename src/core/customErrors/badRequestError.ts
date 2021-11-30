/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import { StatusCodes } from 'http-status-codes'

export default class BadRequestError {
  public readonly statusCode: number = StatusCodes.BAD_REQUEST

  public get message(): string {
    return this._message
  }

  constructor(private _message: string = 'Bad Request') { }
}
