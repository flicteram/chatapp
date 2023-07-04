import useLogout from "../../hooks/useLogout";
import { memo, useState, useEffect, useRef } from 'react'
import UsersModal from "../../components/UsersModal/UsersModal";
import { Outlet, useParams } from 'react-router-dom'
import useUserSelector from '../../components/User/useUserSelector'
import { io } from 'socket.io-client'
import ConnectedUser from "../../interfaces/ConnectedUser";
import GotNewMessage from "../../interfaces/GotNewMeessage";
import useWindowSize from "../../hooks/useWindowSize";
import styles from './Chat.module.css'
import MessageIcon from '@mui/icons-material/Message';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import UserAvatar from "../../components/UserAvatar";
import Conversations from "../../components/Conversations";
import useConversations from "./hooks/useConversations";
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
  const handleToggleModal = () => setOpenModal( prev=>!prev )

  const {
    addLastMessageAndSortConversations,
    dataConversations,
    getConversationsLoading,
    handleCreateConv,
    handleSeenLastMessage
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
    return () => {
      socket.current.disconnect()
    }
  }, [])

  const logout = useLogout()

  const handleWindowHeight = windowWidth > 750 ? {} : { height: windowHeight }
  const handleWindowHeightlow = windowWidth < 750 ? {} : { height: windowHeight }
  if ( getConversationsLoading ) return <CustomLoader />

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
            connectedUsers,
            handleWindowHeight,
            windowHeight
          }} />
      </div>
    </div>
  )
}

export default memo( Chat )