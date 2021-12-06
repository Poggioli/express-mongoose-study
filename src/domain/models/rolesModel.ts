/* eslint-disable no-shadow */
import { model, Model, Schema } from 'mongoose'
import { DefaultModel, defaultModelSchema } from './model'

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

export interface Role extends DefaultModel {
  name: string,
  description: string,
  code: string,
  access: number
}

export const roleSchema = new Schema<Role>({
  ...defaultModelSchema.obj,
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
  }
}, {
  timestamps: true
})

const RoleModel: Model<Role> = model<Role>('Role', roleSchema)
export default RoleModel
