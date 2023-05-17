import { memo, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import { useGetUsers } from "./UsersModalAPI";
import OtherUser from '../../interfaces/OtherUser'
import styles from './UsersModal.module.css'
import CircularProgress from '@mui/material/CircularProgress'
import UserAvatar from '../UserAvatar';

interface Props {
  openModal: boolean,
  onCloseModal: () => void,
  handleCreateConv: (user: OtherUser) => () => Promise<void>,
}

function UsersModal({
  openModal, onCloseModal, handleCreateConv
}: Props) {
  const {
    loadingUsers,
    dataUsers,
    // errorUsers,
    requestUsers
  } = useGetUsers()
  useEffect(() => {
    const controller = new AbortController();
    requestUsers(controller)
    return () => {
      controller.abort()
    }
  }, [])

  return (
    <Dialog
      open={openModal}
      className={styles.dialogContainer}
      onClose={onCloseModal}>
      {loadingUsers ? (
        <CircularProgress
          style={{
            color: 'var(--lightGreen)',
            margin: '2em'
          }}
          thickness={5} />
      ) : (
        dataUsers.length > 0 ?
          <div className={styles.usersContainer}>
            {dataUsers.map((user: OtherUser) => (
              <button
                key={user._id}
                onClick={handleCreateConv(user)}
                className={styles.user}
              >
                <UserAvatar
                  hasProfilePicture={!!user.picture}
                  pictureToShow={user.picture || user.username.slice(0, 2).toUpperCase()}
                  isLoading={false}
                />
                {user.username}
              </button>
            ))}
          </div>
          :
          <h2 style={{ textAlign: 'center' }}>
            No users available
          </h2>
      )
      }
    </Dialog>
  )
}

export default memo(UsersModal)