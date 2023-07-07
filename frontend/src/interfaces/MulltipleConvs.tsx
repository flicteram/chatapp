import SendMessage from './SendMessage'
import OtherUser from './OtherUser'

interface MultipleConvs {
  lastMessage?: SendMessage
  messages: SendMessage[],
  participants: OtherUser[],
  _id: string,
  groupName:string
}

export default MultipleConvs