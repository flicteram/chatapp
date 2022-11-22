import SendMessage from './SendMessage'

interface Conv {
  lastMessage: SendMessage
  messages: SendMessage[],
  participants: {
    username: string,
    _id: string
  }[],
  _id: string

}

export default Conv