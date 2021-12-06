import { Document, Schema } from 'mongoose'

export interface DefaultModel extends Document {
  active?: boolean,
  createdAt?: Date,
  updatedAt?: Date
}

export const defaultModelSchema = new Schema<DefaultModel>({
  active: {
    type: Boolean,
    default: true
  }
})
