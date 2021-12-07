import mongoose from 'mongoose'
import { StateType, Status } from '../../src/domain/models/ordersModel'
import { Order } from '../../src/domain/models'

export default class OrderBuilder {
  private _orderNumber: number | undefined

  private _total: number | undefined

  private _items: mongoose.Types.ObjectId[] | undefined

  private _observation: string | undefined

  private _scheduledAt: Date | undefined

  private _stateType: StateType | undefined

  private _user: mongoose.Types.ObjectId | undefined

  private _status: Status | undefined

  constructor() {
    this._orderNumber = Date.now()
    this._total = 1
    this._items = [new mongoose.Types.ObjectId()]
    this._observation = ''
    this._scheduledAt = new Date()
    this._stateType = StateType.FREEZE
    this._user = new mongoose.Types.ObjectId()
    this._status = Status.ACCEPTED
  }

  public orderNumber(orderNumber: number | undefined): OrderBuilder {
    this._orderNumber = orderNumber
    return this
  }

  public total(total: number | undefined): OrderBuilder {
    this._total = total
    return this
  }

  public items(items: mongoose.Types.ObjectId[] | undefined): OrderBuilder {
    this._items = items
    return this
  }

  public observation(observation: string | undefined): OrderBuilder {
    this._observation = observation
    return this
  }

  public scheduledAt(scheduledAt: Date | undefined): OrderBuilder {
    this._scheduledAt = scheduledAt
    return this
  }

  public stateType(stateType: string | undefined): OrderBuilder {
    this._stateType = stateType as StateType
    return this
  }

  public user(user: mongoose.Types.ObjectId | undefined): OrderBuilder {
    this._user = user
    return this
  }

  public status(status: string | undefined): OrderBuilder {
    this._status = status as Status
    return this
  }

  public build(): Order {
    return {
      orderNumber: this._orderNumber,
      total: this._total,
      items: this._items,
      observation: this._observation,
      scheduledAt: this._scheduledAt,
      stateType: this._stateType,
      user: this._user,
      status: this._status
    } as Order
  }
}
