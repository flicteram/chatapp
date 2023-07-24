import { useEffect } from 'react'
import SendMessage from '@Interfaces/SendMessage'
import GotNewMessage from "@Interfaces/GotNewMeessage";
import { useParams } from 'react-router-dom';

export function useNewMessageSent(
  addNewMessage:( message:SendMessage )=>void,
  handlePendingMessage:( message?:SendMessage )=>void,
  sendMessageData:SendMessage | null
)
{
  useEffect( () => {
    if ( sendMessageData !== null ) {
      addNewMessage( sendMessageData )
      handlePendingMessage()
    }
  }, [sendMessageData])

}

export function useGotNewMessage(
  addGotNewMessage:( gotNewMessage:GotNewMessage )=>void,
  gotNewMessage:GotNewMessage | null,
){
  const convId = useParams()
  useEffect( () => {
    if ( gotNewMessage && gotNewMessage.convId === convId.id ) {
      addGotNewMessage( gotNewMessage )
    }
  }, [gotNewMessage?.newMessage?.sentAt])
}