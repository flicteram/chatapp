import { Schema, model } from 'mongoose'

export interface IUser {
  username: string,
  password: string,
  lastLoggedIn: number,
  conversations:[Map<string, string|string[]>],
  refreshToken?: string,
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
  conversations: {
    type: [Map],
    default: []
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

export default model( 'User', userSchema )