
import bcrypt from 'bcrypt'
import isEmail from 'validator/lib/isEmail'
import jsonwebtoken from 'jsonwebtoken'
import mongoose, {Schema} from 'mongoose'
import Promise from 'bluebird'

const { hashAsync, compareAsync } = Promise.promisifyAll(bcrypt)
const { signAsync } = Promise.promisifyAll(jsonwebtoken)
const BADCREDENTIALS = new Error('Bad Credentials')

const UserSchema = Schema({
  email: { type: String, required: true, validate: [isEmail, 'Email no valido'] },
  password: { type: String, required: true },
  username: { type: String, unique: true, lowercase: true, trim: true },
  firstName: { type: String },
  lastName: { type: String }
}, { timestamps: true, versionKey: false })

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  if (!this.username) this.username = this.email
  hashAsync(this.password, 10)
  .then((hash) => {
    this.password = hash
    next()
  })
})

UserSchema.statics.register = function (data) {
  return this.create(data)
  .then(({ _id, email, username }) => signAsync({ _id, email, username }, 'blackGoku', {}))
}

UserSchema.statics.auth = function (data) {
  if (!data.password || !data.email) return Promise.reject(BADCREDENTIALS)
  return this.findOne({ email: data.email })
  .select('_id password username email').lean().exec()
  .then((user) => {
    if (!user) return Promise.reject(BADCREDENTIALS)
    return compareAsync(data.password, user.password)
    .then((isMatch) =>
      isMatch
      ? signAsync(user, 'blackGoku', {})
      : Promise.reject(BADCREDENTIALS)
    )
  })
}

export default mongoose.model('user', UserSchema, 'users')
