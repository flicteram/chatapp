export default interface GotSeenMessage {
  seenBy: {
    username:string,
    _id:string,
    seenAt:number
  },
  convId: string,
  seenToIds: string,
}