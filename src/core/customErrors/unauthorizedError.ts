/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import { StatusCodes } from 'http-status-codes'

export default class UnauthorizedError {
  public readonly statusCode: number = StatusCodes.UNAUTHORIZED

  public get message(): string {
    return this._message
  }

  constructor(private _message: string = 'Unauthorized') { }
}
