import { memo } from 'react'
import styles from './OtherUser.module.css'
import Skeleton from '@mui/material/Skeleton'

import UserAvatar from "../UserAvatar"
import ConnectedUser from '../../interfaces/ConnectedUser';
import IOtherUser from '../../interfaces/OtherUser';
interface Props {
  connectedUsers: ConnectedUser[],
  isUserLoading:boolean,
  otherUserData:IOtherUser
}

function OtherUser({
  connectedUsers, isUserLoading, otherUserData
}: Props ) {

  const handleLastSeen = ( time: number ) => {
    const date = new Date( time )
    if ( new Date( Date.now() ).toDateString() === date.toDateString() ) {
      return `Last seen today at ${date.toLocaleTimeString( 'en-GB', {
        hour: 'numeric',
        minute: 'numeric'
      })}`
    }
    return `Last seen ${date.toLocaleString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      month: '2-digit',
      day: 'numeric',
      year: 'numeric'
    })}`
  }

  const isOnline = connectedUsers.find( u => u.userId === otherUserData?._id ) !== undefined ?
    "Active now"
    :
    handleLastSeen( otherUserData?.lastLoggedIn || 0 )

  const hasProfilePicture = !!otherUserData?.picture
  const pictureToShow = otherUserData?.picture || otherUserData?.username.slice( 0, 2 ).toUpperCase()

  return (
    <>
      <UserAvatar
        hasProfilePicture={hasProfilePicture}
        pictureToShow={pictureToShow}
        isLoading={false}
      />
      <div className={styles.infoContainer}>
        <span>
          {otherUserData?.username}
        </span>
        {
          isUserLoading ?
            <Skeleton
              variant='text'
              width={100} />
            :
            <span>
              {isOnline}
            </span>
        }
      </div>
    </>
  )
}

export default memo( OtherUser )