import { memo } from 'react'
import styles from './OtherUser.module.css'
import Skeleton from '@mui/material/Skeleton'
import UserAvatar from "Components/UserAvatar"
import ConnectedUser from '@Interfaces/ConnectedUser';
import IOtherUser from '@Interfaces/OtherUser';
interface Props {
  isUserLoading:boolean,
  otherUserData:IOtherUser,
  connectedUsers?: ConnectedUser[],
  seenAt?:number,
  isSelf?:boolean,
}

function OtherUser({
  connectedUsers, isUserLoading, otherUserData, seenAt, isSelf
}: Props ) {

  const handleLastSeen = ( time?: number ) => {
    if( !time ){
      return ''
    }
    const date = new Date( time )
    const displayText = seenAt ? "Message seen" : "Last seen"
    if ( new Date( Date.now() ).toDateString() === date.toDateString() ) {
      return `${displayText} today at ${date.toLocaleTimeString( 'en-GB', {
        hour: 'numeric',
        minute: 'numeric'
      })}`
    }
    return `${displayText} ${date.toLocaleString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      month: '2-digit',
      day: 'numeric',
      year: 'numeric'
    })}`
  }

  const isOnline = connectedUsers?.find( u => u.userId === otherUserData?._id ) !== undefined ?
    "Active now"
    :
    handleLastSeen( otherUserData?.lastLoggedIn || seenAt )

  const hasProfilePicture = !!otherUserData?.picture
  const pictureToShow = otherUserData?.picture || otherUserData?.username.slice( 0, 2 ).toUpperCase()

  return (
    <>
      <UserAvatar
        hasProfilePicture={hasProfilePicture}
        pictureToShow={pictureToShow}
        isLoading={isUserLoading}
      />
      <div className={styles.infoContainer}>
        <span>
          {otherUserData?.username}
        </span>
        {
          isUserLoading ?
            <Skeleton
              data-testid="otherUserLoadingSkeleton"
              variant='text'
              width={100} />
            :
            <span data-testid="userStatus">
              {isSelf?
                "(You)":
                isOnline}
            </span>
        }
      </div>
    </>
  )
}

export default memo( OtherUser )