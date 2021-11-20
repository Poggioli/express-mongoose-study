import {
  Document, Model, model, ObjectId, Schema
} from 'mongoose'

export interface ItemInterface extends Document {
  name: string,
  price: number,
  description: string,
  updatedAt: Date,
  createdAt: Date,
  _id: ObjectId
}

const itemSchema = new Schema({
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
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const Item: Model<ItemInterface> = model<ItemInterface>('Item', itemSchema)
export default Item
