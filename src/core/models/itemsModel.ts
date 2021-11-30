import {
  Document, Model, model, Schema
} from 'mongoose'

export interface Item extends Document {
  name: string,
  price: number,
  description: string,
  active?: boolean,
  createdAt?: Date,
  updatedAt?: Date
}

const itemSchema = new Schema<Item>({
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
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const ItemModel: Model<Item> = model<Item>('Item', itemSchema)
export default ItemModel
