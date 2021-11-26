/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import { StatusCodes } from 'http-status-codes'

export default class ForbiddenError {
  public readonly statusCode: number = StatusCodes.FORBIDDEN

  public get message(): string {
    return this._message
  }

  constructor(private _message: string = 'Forbidden') { }
}
