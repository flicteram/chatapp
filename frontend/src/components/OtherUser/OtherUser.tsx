import { useGetOtherUser } from './OtherUserApi'
import { useEffect, memo } from 'react'
import styles from './OtherUser.module.css'
import Skeleton from '@mui/material/Skeleton'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom'
import UserAvatar from "../UserAvatar"
interface Props {
  otherUser: {
    username: string,
    _id: string,
    picture?:string,
  } | undefined,
  isOnline: boolean
}

function OtherUser({
  otherUser, isOnline
}: Props) {

  const {
    getOtherUserRequest, getOtherUserData, getOtherUserLoading
  } = useGetOtherUser()

  useEffect(() => {
    getOtherUserRequest(otherUser?._id || '')
  }, [isOnline])

  const handleLastSeen = (time: number) => {
    const date = new Date(time)
    if (new Date(Date.now()).toDateString() === date.toDateString()) {
      return `Last seen today at ${date.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric'
      })}`
    }
    return `Last seen ${date.toLocaleString('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      month: '2-digit',
      day: 'numeric',
      year: 'numeric'
    })}`
  }

  const handleIsOnline = (isOnline:boolean) =>(
    isOnline ?
      "Active now"
      :
      handleLastSeen(getOtherUserData?.lastLoggedIn || 0)
  )

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/chat')
  }

  const hasProfilePicture = !!getOtherUserData?.picture
  const pictureToShow = getOtherUserData?.picture || otherUser?.username.slice(0, 2).toLocaleUpperCase()

  return (
    <div className={styles.container}>
      <button onClick={handleGoBack}>
        <ArrowBackIosIcon />
      </button>
      <UserAvatar
        hasProfilePicture={hasProfilePicture}
        pictureToShow={pictureToShow}
        isLoading={getOtherUserLoading}
      />
      <div>
        <span>
          {otherUser?.username}
        </span>
        {
          getOtherUserLoading ?
            <Skeleton
              variant='text'
              width={100} />
            :
            <span>
              {handleIsOnline(isOnline)}
            </span>
        }
      </div>

    </div>
  )
}

export default memo(OtherUser)