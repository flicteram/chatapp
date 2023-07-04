import { memo } from 'react'
import UserAvatar from "../UserAvatar"
import GroupIcon from '@mui/icons-material/Group';
import styles from './GroupHeader.module.css'
import OtherUser from '../../interfaces/OtherUser';
import Skeleton from '@mui/material/Skeleton'

interface Props {
  participants:OtherUser[],
  isLoading:boolean,
  groupName:string
}
export default memo( function GroupHeader({
  participants, isLoading, groupName
}:Props ){

  const participantsUsernames = participants.map( p=>p.username ).join( ", " )

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
          <span>
            {participantsUsernames}
          </span>
        }
      </div>
    </>

  )
})