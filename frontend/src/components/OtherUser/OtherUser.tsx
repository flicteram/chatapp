import { useGetOtherUser } from './OtherUserApi'
import { useEffect, memo } from 'react'
import Avatar from '@mui/material/Avatar';
import styles from './OtherUser.module.css'
import Skeleton from '@mui/material/Skeleton'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom'

interface Props {
  otherUser: {
    username: string,
    _id: string
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

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/chat')
  }

  return (
    <div className={styles.container}>
      <button onClick={handleGoBack}>
        <ArrowBackIosIcon />
      </button>
      <Avatar />
      <div>
        <span>
          {otherUser?.username}
        </span>
        {
          getOtherUserLoading ?
            <Skeleton
              variant='text'
              width={100} /> :
            <span>
              {isOnline ?
                "Active now "
                :
                handleLastSeen(getOtherUserData?.lastLoggedIn || 0)
              }
            </span>
        }
      </div>

    </div>
  )
}

export default memo(OtherUser)