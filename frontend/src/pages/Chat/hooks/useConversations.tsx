import { useEffect } from 'react'
import { useGetConversations } from '../ChatAPI'
import GotNewMessage from "@Interfaces/GotNewMeessage";
import { useParams } from 'react-router-dom'
import useUserSelector from 'Components/User/useUserSelector'
import useGotNewConversation from './useGotNewConversation'
import useCreateConv from './useCreateConv'
export default function useConversations(
  gotNewMessage: GotNewMessage | null,
  handleToggleModal: ()=>void
){
  const {
    dataConversations,
    error,
    isLoading,
    request,
    handleAddCreatedConversation,
    handleAddNewConversation,
    addLastMessageAndSortConversations,
    handleMakeMessagesSeen,
    handleUpdateLastMessageConversations
  } = useGetConversations()

  const handleCreateConv = useCreateConv( handleToggleModal, handleAddCreatedConversation )
  useGotNewConversation( gotNewMessage, handleAddNewConversation, dataConversations )

  const params = useParams()

  const currentUser = useUserSelector()

  const handleSeenLastMessage = () => {
    const hasLastMessageSeen = dataConversations.find( conv => conv._id === params.id )
    if (
      hasLastMessageSeen?.lastMessage?.sentBy.username !== currentUser.username
      &&
      !hasLastMessageSeen?.lastMessage?.seenByIds?.includes( currentUser._id )
    ) {
      handleMakeMessagesSeen()
    }
  }

  useEffect( ()=>{
    request()
  }, [])

  return {
    handleCreateConv,
    addLastMessageAndSortConversations,
    handleSeenLastMessage,
    getConversationsError: error,
    getConversationsLoading: isLoading,
    dataConversations,
    handleUpdateLastMessageConversations
  }
}
