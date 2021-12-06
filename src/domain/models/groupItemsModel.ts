import mongoose, { Document, Schema } from 'mongoose'
import { Item } from './itemsModel'

export interface GroupItem extends Document {
  name: string,
  description: string,
  items: mongoose.Types.ObjectId[] | Item[]
  active?: boolean,
  createdAt: Date,
  updatedAt?: Date
}

const groupItemSchema = new Schema<GroupItem>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  items: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }],
    validate: [(v: any[]) => Array.isArray(v) && v.length > 0, '{PATH} is shorter than the minimum allowed length (1).']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const GroupItemModel = mongoose.model<GroupItem>('GroupItem', groupItemSchema)
export default GroupItemModel
