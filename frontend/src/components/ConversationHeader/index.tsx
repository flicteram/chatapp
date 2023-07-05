import { memo } from "react"
import ConnectedUser from "../../interfaces/ConnectedUser"
import OtherUser from "../OtherUser"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom'
import styles from './ConversationHeader.module.css'
import GroupHeader from "../GroupHeader";
import IOtherUser from '../../interfaces/OtherUser'
interface Props {
  otherUsersIds:string[] | undefined,
  connectedUsers: ConnectedUser[],
  groupName:string,
  convUsersData:IOtherUser[],
  convUsersLoading:boolean
}

function ConversationHeader({
  otherUsersIds, connectedUsers, groupName, convUsersData, convUsersLoading
}: Props ){

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
          connectedUsers={connectedUsers}
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