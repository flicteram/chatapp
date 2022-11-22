export default interface SendMessage {
  message: string,
  sentBy: {
    username: string,
    _id: string
  },
  sentAt: number,
  seen: boolean
}
