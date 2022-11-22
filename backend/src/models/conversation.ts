import { Types } from 'mongoose'
import { Schema, model } from 'mongoose';

interface Conversation {
  messages: Types.Array<Map<string, string>>,
  participants: Types.Array<Map<string, string>>,
  lastMessage: Map<string, string>,
}

const conversationSchema = new Schema<Conversation>({
  messages: {
    type: [Map],
    default: Array
  },
  participants: {
    type: [Map],
    required: [true, "No participants sent"],
  },
  lastMessage: {
    type: Map,
    default: {}
  }
})

export default model<Conversation>('Conversation', conversationSchema);