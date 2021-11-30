/* eslint-disable func-names */
/* eslint-disable no-useless-escape */
import { NextFunction } from 'express'
import mongoose, { Document, Model, Schema } from 'mongoose'
import * as bcrypt from 'bcrypt'
import environment from '@src/environment'

export interface User extends Document {
  name: string,
  email: string,
  password: string,
  active?: boolean,
  createdAt?: Date,
  updatedAt?: Date
  matches(password: string): boolean
}

interface UserModelFindByEmail extends Model<User> {
  findByEmail(email: string, projection?: string): Promise<User | null>
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // eslint-disable-next-line max-len
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  },
  active: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, {
  timestamps: true
})

userSchema.statics.findByEmail = function (email: string, projection?: string) {
  return this.findOne({ email }, projection)
}

userSchema.methods.matches = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

const hashPassword = (user: User, next: NextFunction) => {
  bcrypt
    .hash(user.password, environment.security.roundSalts as number)
    .then((hash: string) => {
      // eslint-disable-next-line no-param-reassign
      user.password = hash
      next()
    })
    .catch(next)
}

const saveMiddleware = function (this: any, next: any) {
  hashPassword(this, next)
}

const updateMiddleware = function (this: any, next: any) {
  if (!this.getUpdate().password) {
    next()
  } else {
    hashPassword(this.getUpdate(), next)
  }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)

const UserModel = mongoose.model<User, UserModelFindByEmail>('User', userSchema)
export default UserModel
