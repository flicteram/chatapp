import { memo, useState } from 'react'
import UserAvatar from "../UserAvatar"
import GroupIcon from '@mui/icons-material/Group';
import styles from './GroupHeader.module.css'
import IOtherUser from '@Interfaces/OtherUser';
import Skeleton from '@mui/material/Skeleton'
import Dialog from '@mui/material/Dialog'
import OtherUser from '../OtherUser';
import IConnectedUser from '@Interfaces/ConnectedUser';
import useUserSelector from '../User/useUserSelector';
interface Props {
  participants:IOtherUser[],
  isLoading:boolean,
  groupName:string,
  connectedUsers:IConnectedUser[]
}
export default memo( function GroupHeader({
  participants, isLoading, groupName, connectedUsers
}:Props ){
  const [isOpen, setIsOpen] = useState( false )
  const toggleDialog = () =>{
    setIsOpen( prev=>!prev )
  }
  const currentUser = useUserSelector()
  const participantsAll = [{
    username: currentUser.username,
    _id: currentUser._id,
    picture: currentUser?.picture
  }, ...participants]
  const participantsUsernames = participantsAll.map( p=>p.username===currentUser.username? "You" : p.username ).join( ", " )

  return(
    <>
      <UserAvatar
        hasProfilePicture={false}
        pictureToShow={<GroupIcon/>}
        isLoading={isLoading}/>
      <div className={styles.infoContainer}>
        <span>
          {groupName}
        </span>
        {isLoading ?
          <Skeleton width={100}/>:
          <button onClick={toggleDialog}>
            {participantsUsernames}
          </button>
        }
      </div>
      <Dialog
        open={isOpen}
        onClose={toggleDialog}
      >
        <div className={styles.usersDataContainer}>
          <h4>{`${groupName}'s participants`}</h4>
          {participantsAll.map( participant=>(
            <div
              style={{
                display: 'flex',
                gap: '.5em'
              }}
              key={participant._id}>
              <OtherUser
                isUserLoading={false}
                otherUserData={participant}
                connectedUsers={connectedUsers}
                isSelf={participant._id === currentUser._id}
              />
            </div>
          ) )}
        </div>
      </Dialog>
    </>

  )
})