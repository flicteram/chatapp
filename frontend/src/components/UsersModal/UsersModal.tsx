import { memo, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import { useGetUsers } from "./UsersModalAPI";
import { User } from '../../interfaces/User'
import Avatar from '@mui/material/Avatar'
import styles from './UsersModal.module.css'
import CircularProgress from '@mui/material/CircularProgress'

interface Props {
  openModal: boolean,
  onCloseModal: () => void,
  handleCreateConv: (user: User) => () => Promise<void>,
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
          style={{ color: 'var(--lightGreen)' }}
          thickness={5} />
      ) : (
        <div className={styles.usersContainer}>
          {dataUsers.map((user: User) => (
            <button
              key={user._id}
              onClick={handleCreateConv(user)}
              className={styles.user}
            >
              <Avatar />
              {user.username}
            </button>
          ))}
        </div>

      )
      }
    </Dialog>
  )
}

export default memo(UsersModal)