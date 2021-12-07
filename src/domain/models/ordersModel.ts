/* eslint-disable no-shadow */
import mongoose, { Model, model, Schema } from 'mongoose'
import { User } from './usersModel'
import { Item } from './itemsModel'
import { DefaultModel, defaultModelSchema } from './model'

export enum StateType {
  READY = 'READY',
  FREEZE = 'FREEZE'
}

export enum Status {
  ACCEPTED = 'ACCEPTED',
  STARTED = 'STARTED',
  CANCELED = 'CANCELED',
  FINISHED = 'FINISHED'
}

export interface Order extends DefaultModel {
  orderNumber: number,
  total: number,
  items: mongoose.Types.ObjectId[] | Item[],
  observation: string,
  scheduledAt: Date,
  stateType: StateType,
  user: mongoose.Types.ObjectId | User,
  status: Status
}

const orderSchema = new Schema<Order>({
  ...defaultModelSchema.obj,
  orderNumber: {
    type: Number,
    default: Date.now()
  },
  total: {
    type: Number,
    required: true,
    min: 1
  },
  items: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }],
    validate: [(v: any[]) => Array.isArray(v) && v.length > 0, '{PATH} is shorter than the minimum allowed length (1).']
  },
  observation: {
    type: String,
    required: false,
    trim: true,
    maxlength: 300
  },
  scheduledAt: {
    type: Date,
    validate: [(v: Date) => {
      const todayWithoutHour: Date = new Date()
      todayWithoutHour.setHours(0, 0, 0, 0)
      return !v ? false : v.getTime() >= todayWithoutHour.getTime()
    }, '{PATH} should be today or next days.']
  },
  stateType: {
    type: String,
    enum: StateType,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: Status,
    required: true
  }
}, {
  timestamps: true
})

const OrderModel: Model<Order> = model<Order>('Order', orderSchema)
export default OrderModel
