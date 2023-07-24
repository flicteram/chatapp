import { useEffect } from 'react'
import { useGetConversationNew } from '../ChatAPI'
import GotNewMessage from "@Interfaces/GotNewMeessage";
import MultipleConvs from '@Interfaces/MulltipleConvs';

export default function useGotNewConversation(
  gotNewMessage: GotNewMessage | null,
  handleAddNewConversation:( dataNewConversation:MultipleConvs )=>void,
  dataConversations:MultipleConvs[]
){
  const {
    dataNewConversation,
    requestNewConversation
  } = useGetConversationNew()

  useEffect( () => {
    if ( dataNewConversation !== null ) {
      handleAddNewConversation( dataNewConversation )
    }
  }, [dataNewConversation])

  useEffect( () => {
    if ( gotNewMessage && !dataConversations.some( conv => conv._id === gotNewMessage.convId ) ) {
      requestNewConversation( gotNewMessage.convId )
    }
  }, [gotNewMessage])
}