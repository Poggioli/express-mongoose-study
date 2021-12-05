/* eslint-disable no-shadow */
import {
  Document, model, Model, Schema
} from 'mongoose'

/**
 * SYSADM = U1lTQURN = 30
 * ADM = QURN 20
 * SYSUSER = U1lTVVNFUg== 10
 * USER = VVNFUg== 0
 */

export enum CodeRoles {
  SYSADM = 'U1lTQURN',
  ADM = 'QURN',
  SYSUSER = 'U1lTVVNFUg==',
  USER = 'VVNFUg=='
}

export interface Role extends Document {
  name: string,
  description: string,
  code: string,
  access: number,
  active: boolean,
  createdAt?: Date,
  updatedAt?: Date
}

export const roleSchema = new Schema<Role>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 300,
    trim: true
  },
  code: {
    type: String,
    enum: CodeRoles,
    required: true
  },
  access: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const RoleModel: Model<Role> = model<Role>('Role', roleSchema)
export default RoleModel
