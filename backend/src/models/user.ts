import { Schema, model } from 'mongoose'

interface IUser {
  username: string,
  password: string,
  refreshToken?: string,
  lastLoggedIn: number,
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    default: ''
  },
  lastLoggedIn: {
    type: Number,
    required: true,
  }
})

export default model('User', userSchema)