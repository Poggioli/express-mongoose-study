import { Model, model, Schema } from 'mongoose'
import { DefaultModel, defaultModelSchema } from './model'

export interface Item extends DefaultModel {
  name: string,
  price: number,
  description: string
}

const itemSchema = new Schema<Item>({
  ...defaultModelSchema.obj,
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  }
}, {
  timestamps: true
})

const ItemModel: Model<Item> = model<Item>('Item', itemSchema)
export default ItemModel
