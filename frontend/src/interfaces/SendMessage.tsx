export default interface SendMessage {
  message: string,
  sentBy: {
    username: string,
    _id: string
  },
  seenByIds?:string[],
  seenBy?: {
    username:string,
    _id:string,
    seenAt:number
  }[],
  sentAt: number,
  pending?:boolean
}
