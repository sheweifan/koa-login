import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { setMeta } from '../utils'

const SALT = 10
const MAX_ATTEMPT = 5
const LOCKTIME = 2 * 60 * 60 * 1000

let UserSchema = new Schema({
  role: {
    type: String,
    default: 'user'
  },
  openid: [String],
  unionid: String,
  nickname: String,
  email: String,
  password: String,
  hashed_password: String,
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

UserSchema.pre('save', setMeta)

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next(error)

      this.password = hash

      next()
    })
  })
})

UserSchema.methods = {
  comparePassword (_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => err ? reject(err) : resolve(isMatch))
    })
  },
  incLoginAttempts () {
    return new Promise((resolve, reject) => {
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, err => err ? reject(err) : resolve(true))
      } else {
        let update = {
          $inc: {
            loginAttempts: 1
          }
        }

        if (this.loginAttempts + 1 >= MAX_ATTEMPT && !this.isLocked) {
          update.$set = {
            lockUntil: Date.now() + LOCKTIME
          }
        }
        this.update(update, err => err ? reject(err) : resolve(true))
      }
    })
  }
}

mongoose.model('user', UserSchema)
