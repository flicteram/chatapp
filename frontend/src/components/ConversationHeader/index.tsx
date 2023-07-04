import { useEffect, memo } from "react"
import ConnectedUser from "../../interfaces/ConnectedUser"
import OtherUser from "../OtherUser"
import { useConversationUsers } from "./ConversationHeaderAPI"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom'
import styles from './ConversationHeader.module.css'
import GroupHeader from "../GroupHeader";
interface Props {
  otherUsersIds:string[] | undefined,
  connectedUsers: ConnectedUser[],
  groupName:string
}

function ConversationHeader({
  otherUsersIds, connectedUsers, groupName
}: Props ){

  const {
    convUsersData, convUsersLoading, getConvUsers
  } = useConversationUsers()

  useEffect( ()=>{
    getConvUsers( otherUsersIds )
  }, [otherUsersIds])

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate( '/chat' )
  }

  const isGroupChat = otherUsersIds && otherUsersIds.length>1

  const [otherUserData] = convUsersData

  return (
    <div className={styles.container}>
      <button onClick={handleGoBack}>
        <ArrowBackIosIcon />
      </button>
      {isGroupChat ?
        <GroupHeader
          groupName={groupName}
          isLoading={convUsersLoading}
          participants={convUsersData}
        />
        :
        <OtherUser
          otherUserData={otherUserData}
          isUserLoading={convUsersLoading}
          connectedUsers={connectedUsers}/>
      }
    </div>

  )
}

export default memo( ConversationHeader )