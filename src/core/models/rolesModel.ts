import {
  Document, model, Model, Schema
} from 'mongoose'

/**
 * SYSADM = U1lTQURN = 30
 * ADM = QURN 20
 * SYSUSER = U1lTVVNFUg== 10
 * USER = VVNFUg== 0
 */

export interface Role extends Document {
  name: string,
  description: string,
  code: string,
  access: number
}

const roleSchema = new Schema<Role>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    enum: ['SYSADM', 'ADM', 'SYSUSER', 'USER'],
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
