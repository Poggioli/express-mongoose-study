/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import { StatusCodes } from 'http-status-codes'

export default class NotFound {
  public readonly statusCode: number = StatusCodes.NOT_FOUND

  public get message(): string {
    return this._message
  }

  constructor(private _message: string = 'Document Not Found') { }
}
