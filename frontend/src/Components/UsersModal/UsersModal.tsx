import { memo, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import { useGetUsers } from "./UsersModalAPI";
import OtherUser from '@Interfaces/OtherUser'
import styles from './UsersModal.module.css'
import CircularProgress from '@mui/material/CircularProgress'
import UserAvatar from '../UserAvatar';
import MultipleConvs from '@Interfaces/MulltipleConvs';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import handleHelperText from 'Utils/hadleHelperText'
import { ICreateConversation } from '../../pages/Chat/ChatAPI';

interface Props {
  openModal: boolean,
  onCloseModal: () => void,
  handleCreateConv: ( data: ICreateConversation ) => Promise<void>,
  dataConversations:MultipleConvs[]
}

interface InitialValues {
  groupName:string
}

function UsersModal({
  openModal,
  onCloseModal,
  handleCreateConv,
  dataConversations
}: Props ) {
  const [usersIds, setUsersIds] = useState<string[]>([])
  const [existingConversation, setExistingConversation] = useState<MultipleConvs>({}as MultipleConvs )
  const {
    loadingUsers,
    dataUsers,
    // errorUsers,
    requestUsers
  } = useGetUsers()

  const handleOnClickUser = ( user:OtherUser ) =>{
    return () =>{
      if( usersIds.includes( user._id ) ){
        setUsersIds( prev=>prev.filter( id=>id!==user._id ) )
      }else{
        setUsersIds( prev=>[...prev, user._id])
      }
    }
  }

  const navigate = useNavigate()

  const handleOnClickCreate = ({ groupName }:InitialValues ) =>{
    if( existingConversation?._id ){
      navigate( existingConversation._id )
      onCloseModal()
      return
    }
    if( usersIds.length>1 && groupName ){
      handleCreateConv({
        groupName,
        usersIds
      })
      return
    }
    handleCreateConv({
      groupName: '',
      usersIds
    })
  }

  useEffect( ()=>{
    if( usersIds.length===1 ){
      const existingConv = dataConversations.find( conv=>( conv.participants.length===1 && conv.participants[0]._id ) === usersIds[0])
      if( existingConv ){
        setExistingConversation( existingConv )
      }
    }
    if( usersIds.length===2 || usersIds.length===0 ){
      setExistingConversation({} as MultipleConvs )
    }
  }, [usersIds.length])

  useEffect( () => {
    const controller = new AbortController();
    requestUsers( controller )
    return () => {
      controller.abort()
    }
  }, [])

  const validate = ( values:InitialValues )=>{
    const errors = {} as InitialValues
    if( usersIds.length>1 && values.groupName.trim().length===0 ){
      errors.groupName = "Please add a group name"
    }
    return errors
  }

  const formik = useFormik({
    initialValues: { groupName: '' },
    validate,
    onSubmit: handleOnClickCreate
  })

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
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            className={styles.container}
          >
            <TextField
              disabled={usersIds.length<2}
              label="Group Name"
              helperText={handleHelperText( formik.errors.groupName, formik.touched.groupName )}
              name='groupName'
              value={formik.values.groupName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.groupName !== undefined && formik.touched.groupName}
            />
            <div className={styles.usersContainer}>
              {dataUsers.map( ( user: OtherUser ) => (
                <button
                  type='button'
                  key={user._id}
                  onClick={handleOnClickUser( user )}
                  className={styles.user}
                  style={usersIds.includes( user._id )?{ background: "green" }:{}}
                >
                  <UserAvatar
                    hasProfilePicture={!!user.picture}
                    pictureToShow={user.picture || user.username.slice( 0, 2 ).toUpperCase()}
                    isLoading={false}
                  />
                  {user.username}
                </button>
              ) )}
            </div>
            <Button
              type='submit'
              variant='contained'
              disabled={usersIds.length<1}
              style={{ margin: '0' }}
            >
              {existingConversation._id ?
                "Go to conversation"
                :
                "Create conversation"
              }
            </Button>
          </Box>
          :
          <h2 style={{ textAlign: 'center' }}>
            No users available
          </h2>
      )
      }
    </Dialog>
  )
}

export default memo( UsersModal )