import { useState } from 'react'
import SendMessage from '../../../interfaces/SendMessage'
import IOtherUser from '../../../interfaces/OtherUser'
import Conversation from '../../../interfaces/Conversation'

type ISeenBy = IOtherUser & {
  seenAt: number
}

export interface MessageInfo extends Omit<SendMessage, "seenBy"> {
  seenBy?: ISeenBy[],
}

export default function useMessageInfo(
  convsData: Conversation | null,
  convUsersData: IOtherUser[]
){
  const [messageInfo, setMessageInfo] = useState<MessageInfo>({} as MessageInfo )
  const [isDialogOpen, setIsDialogOpen] = useState( false )
  const toggleDialog = () => setIsDialogOpen( prev=>!prev )
  const handleMessageInfo =  ( messageInfo:SendMessage, isSelfMessage:boolean ) => {
    return () =>{
      if( convsData?.participants && convsData.participants.length>2 && isSelfMessage ){
        const seenByUsers = {
          ...messageInfo,
          seenBy: messageInfo?.seenBy?.reduce( ( acc:ISeenBy[], currentVal:ISeenBy )=>{
            const foundConvUser = convUsersData.find( u=>u._id===currentVal._id )
            if( foundConvUser ){
              acc.push({
                username: currentVal.username,
                _id: currentVal._id,
                seenAt: currentVal.seenAt,
                picture: foundConvUser?.picture,
              } as ISeenBy )
            }
            return acc
          }, [])
        }
        setMessageInfo( seenByUsers )
        toggleDialog()
      }
    }
  }

  return{
    messageInfo,
    isDialogOpen,
    toggleDialog,
    handleMessageInfo
  }
}