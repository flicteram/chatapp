import { Schema, model } from 'mongoose'

export interface IUserGoogle {
  username: string,
  email: string,
  picture: string,
  lastLoggedIn: number,
  conversations:[Map<string, string>],
  refreshToken?: string,
}

const googleUserSchema = new Schema<IUserGoogle>({
  username: {
    type: String,
    required: true,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true
  },
  picture: {
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

export default model('GoogleUser', googleUserSchema)