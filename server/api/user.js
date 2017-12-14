import mongoose from 'mongoose'

const User = mongoose.model('user')

export const login = async (email, password) => {
  let match = false
  const user = await User.findOne({email}).exec()

  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match, user
  }
}
