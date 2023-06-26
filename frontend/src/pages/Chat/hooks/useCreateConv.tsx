import { useEffect } from 'react'
import { useCreateConversation } from '../ChatAPI'
import OtherUser from "../../../interfaces/OtherUser";
import Conv from '../../../interfaces/Conversation';

export default function useCreateConv(
  handleToggleModal:()=>void,
  handleAddCreatedConversation:(convData:Conv)=>void
){
  const {
    dataCreateConv, requestCreateConv
  } = useCreateConversation()

  const handleCreateConv = (user: OtherUser) => {
    return async () => {
      const sendUser = {
        otherUser: {
          username: user.username,
          _id: user._id
        }
      }
      await requestCreateConv(sendUser)
      handleToggleModal()
    }
  }
  useEffect(() => {
    if (dataCreateConv !== null) {
      handleAddCreatedConversation(dataCreateConv)
    }
  }, [dataCreateConv])

  return handleCreateConv
}