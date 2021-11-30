/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

export default class UnprocessableEntityError {
  public readonly statusCode: number = StatusCodes.UNPROCESSABLE_ENTITY

  public get message(): string {
    return this._message
  }

  constructor(private _message: string = ReasonPhrases.UNPROCESSABLE_ENTITY) { }
}
