import { useEffect } from 'react'
import SendMessage from '../../../interfaces/SendMessage'
import GotNewMessage from "../../../interfaces/GotNewMeessage";
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
    console.log( 'gotNewMessage', gotNewMessage )
    if ( gotNewMessage !== null && gotNewMessage.convId === convId.id ) {
      addGotNewMessage( gotNewMessage )
    }
  }, [gotNewMessage])
}