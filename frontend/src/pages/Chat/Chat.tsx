import useLogout from "Hooks/useLogout";
import { memo, useState, useEffect, useRef } from 'react'
import UsersModal from "Components/UsersModal/UsersModal";
import { Outlet, useParams } from 'react-router-dom'
import useUserSelector from 'Components/User/useUserSelector'
import { io } from 'socket.io-client'
import ConnectedUser from "@Interfaces/ConnectedUser";
import GotNewMessage from "@Interfaces/GotNewMeessage";
import useWindowSize from "Hooks/useWindowSize";
import styles from './Chat.module.css'
import MessageIcon from '@mui/icons-material/Message';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomLoader from "Components/CustomLoader/CustomLoader";
import UserAvatar from "Components/UserAvatar";
import Conversations from "Components/Conversations";
import useConversations from "./hooks/useConversations";
import GotSeenMessage from '@Interfaces/GotSeenMessage'
const url = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/'

function Chat() {

  const params = useParams()
  const socket = useRef( io( url, { autoConnect: false }) )
  const {
    windowWidth,
    windowHeight
  } = useWindowSize()
  const currentUser = useUserSelector()
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([])
  const [openModal, setOpenModal] = useState( false )
  const [gotNewMessage, setGotNewMessage] = useState<GotNewMessage | null>( null )
  const [gotSeenMsg, setGotSeenMsg] = useState<GotSeenMessage | null>( null );
  const handleToggleModal = () => setOpenModal( prev=>!prev )

  const {
    addLastMessageAndSortConversations,
    dataConversations,
    getConversationsLoading,
    handleCreateConv,
    handleSeenLastMessage,
    handleUpdateLastMessageConversations
  } = useConversations( gotNewMessage, handleToggleModal )

  useEffect( () => {
    socket.current.connect()
    socket.current.emit( "userConnected", {
      username: currentUser.username,
      userId: currentUser._id,
    })
    socket.current.on( "connectedUsers", ( users ) => {
      setConnectedUsers( users )
    })
    socket.current.on( "gotNewMessage", ( message ) => {
      setGotNewMessage( message )
      addLastMessageAndSortConversations( message.convId, message.newMessage )
    })
    socket.current.on( 'gotSeenMessages', ( seenMsgData:GotSeenMessage ) => {
      setGotSeenMsg( seenMsgData )
      handleUpdateLastMessageConversations( seenMsgData )
    })
    return () => {
      socket.current.disconnect()
      socket.current.off( "gotSeenMessages" )
      socket.current.off( "gotNewMessage" )
      socket.current.off( "connectedUsers" )
    }
  }, [])

  const logout = useLogout()

  const handleWindowHeight = windowWidth > 750 ? {} : { height: windowHeight }
  const handleWindowHeightlow = windowWidth < 750 ? {} : { height: windowHeight }
  if ( getConversationsLoading ) return <CustomLoader data-testid="getConvsLoading"/>

  return (
    <div
      className={styles.outerContainer}
      style={handleWindowHeightlow}>
      <div className={styles.styleBigScreen} />
      <div
        className={styles.container}
        style={handleWindowHeight}>
        {( !params.id || windowWidth >= 750 ) &&
          <div
            className={styles.leftSideContainer}>
            <div className={styles.actionsContainer}>
              <UserAvatar
                hasProfilePicture={!!currentUser.picture}
                pictureToShow={currentUser.picture || currentUser.username.slice( 0, 2 ).toLocaleUpperCase()}
                isLoading={false}
              />
              <div>
                <button onClick={handleToggleModal}><MessageIcon /></button>
                <button onClick={logout}><LogoutIcon /></button>
              </div>
            </div>
            <Conversations
              connectedUsers={connectedUsers}
              dataConversations={dataConversations}
            />
            {openModal &&
              <UsersModal
                dataConversations={dataConversations}
                handleCreateConv={handleCreateConv}
                openModal={openModal}
                onCloseModal={handleToggleModal} />}
          </div>
        }
        {
          ( !params.id && windowWidth >= 750 )
          &&
          <div className={styles.selectOrCreateConv}>
            <ArrowBackIcon />
            Select or create a new conversation!
          </div>
        }
        <Outlet
          context={{
            socket,
            gotNewMessage,
            handleSeenLastMessage,
            addLastMessageAndSortConversations,
            handleUpdateLastMessageConversations,
            gotSeenMsg,
            connectedUsers,
            handleWindowHeight,
            windowHeight
          }} />
      </div>
    </div>
  )
}

export default memo( Chat )