import { useEffect } from 'react'
import { useConversationUsers } from "../ConversationAPI"

export default function useReturnConversationUsers( otherUsersIds?:string[]){
  const {
    convUsersData, convUsersLoading, getConvUsers
  } = useConversationUsers()

  useEffect( ()=>{
    getConvUsers( otherUsersIds )
  }, [otherUsersIds])

  return {
    convUsersData,
    convUsersLoading
  }
}