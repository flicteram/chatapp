export default interface SendMessage {
  message: string,
  sentBy: {
    username: string,
    _id: string
  },
  seenBy:string[]
  sentAt: number,
  pending?:boolean
}
