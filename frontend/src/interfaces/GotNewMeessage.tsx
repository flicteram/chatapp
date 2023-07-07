import SendMessage from "./SendMessage";

export default interface GotNewMessage {
  newMessage: SendMessage,
  convId: string,
  sentToIds: string[]
}