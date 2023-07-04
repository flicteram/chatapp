import { Types } from 'mongoose'
import { Schema, model } from 'mongoose';

interface Conversation {
  messages: Types.Array<Map<string, string>>,
  participants: string[],
  lastMessage: Map<string, string>,
  groupName:string
}

const conversationSchema = new Schema<Conversation>({
  messages: {
    type: [Map],
    default: Array
  },
  participants: {
    type: [String],
    required: [true, "No participants sent"],
  },
  lastMessage: {
    type: Map,
    default: {}
  },
  groupName: {
    type: String,
    default: ""
  }
})

export default model<Conversation>( 'Conversation', conversationSchema );