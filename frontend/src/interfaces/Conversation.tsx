import SendMessage from './SendMessage'
import OtherUser from './OtherUser'

interface Conv {
  lastMessage: SendMessage
  messages: SendMessage[],
  participants: OtherUser[],
  _id: string

}

export default Conv