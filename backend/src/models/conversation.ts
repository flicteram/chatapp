import { Schema, model } from 'mongoose';

interface Message {
  message: string,
  seenByIds: string[],
  seenBy: [{
    username: string,
    seenAt: number,
    _id: string
  }],
  sentAt: number,
  sentBy: {
    username: string,
    _id: string
  }
}

interface Conversation {
  messages: Message[],
  participants: string[],
  lastMessage: Message,
  groupName:string
}
const conversationSchema = new Schema<Conversation>({
  messages: {
    type: [{
      message: String,
      seenByIds: [String],
      seenBy: [{
        username: String,
        seenAt: Number,
        _id: String
      }],
      sentAt: Number,
      sentBy: {
        username: String,
        _id: String
      }
    }],
    default: Array
  },
  participants: {
    type: [String],
    required: [true, "No participants sent"],
  },
  lastMessage: {
    type: {
      message: String,
      seenByIds: [String],
      seenBy: [{
        username: String,
        seenAt: Number,
        _id: String
      }],
      sentAt: Number,
      sentBy: {
        username: String,
        _id: String
      }
    },
    default: {}
  },
  groupName: {
    type: String,
    default: ""
  }
})

export default model<Conversation>( 'Conversation', conversationSchema );