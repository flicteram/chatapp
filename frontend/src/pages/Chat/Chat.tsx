import useLogout from "../../hooks/useLogout";
import { memo, useState, useEffect, useRef, useCallback } from 'react'
import UsersModal from "../../components/UsersModal/UsersModal";
import { Outlet, useParams } from 'react-router-dom'
import { useGetConversations, useCreateConversation, useGetConversationNew } from "./ChatAPI";
import useUserSelector from '../../components/User/useUserSelector'
import { io } from 'socket.io-client'
import ConnectedUser from "../../interfaces/ConnectedUser";
import GotNewMessage from "../../interfaces/GotNewMeessage";
import SendMessage from '../../interfaces/SendMessage'
import useWindowSize from "../../hooks/useWindowSize";
import styles from './Chat.module.css'
import MessageIcon from '@mui/icons-material/Message';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import UserAvatar from "../../components/UserAvatar";
import OtherUser from "../../interfaces/OtherUser";
import Conversations from "../../components/Conversations";
const url = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/'

function Chat() {

  const useGetConversationsMemo = useCallback(() => useGetConversations(), [])
  const {
    request, dataConversations, isLoading, setAddConversation
  } = useGetConversationsMemo()

  const {
    requestCreateConv, dataCreateConv
  } = useCreateConversation()
  const {
    dataNewConversation, requestNewConversation
  } = useGetConversationNew()

  const params = useParams()
  const socket = useRef(io(url, { autoConnect: false }))
  const {
    windowWidth,
    windowHeight
  } = useWindowSize()

  const currentUser = useUserSelector()
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [gotNewMessage, setGotNewMessage] = useState<GotNewMessage | null>(null)
  const handleOnCloseModal = () => setOpenModal(false)
  const handleSeenLastMessage = () => {
    const hasLastMessageSeen = dataConversations.find(conv => conv._id === params.id)
    if (
      hasLastMessageSeen?.lastMessage.seen === false
      &&
      hasLastMessageSeen.lastMessage.sentBy.username !== currentUser.username
    ) {
      setAddConversation(prevState => prevState.map(conv => {
        if (conv._id === params.id
          &&
          conv.lastMessage.seen === false
          &&
          conv.lastMessage.sentBy.username !== currentUser.username) {
          return {
            ...conv,
            lastMessage: {
              ...conv.lastMessage,
              seen: true
            }
          }
        }
        return conv
      }))
    }
  }
  const addLastMessageAndSortConversations = useCallback((sendToId: string, message: SendMessage) => {
    setAddConversation(prevState => prevState.map(conv => {
      if (conv._id === sendToId) {
        return {
          ...conv,
          lastMessage: message
        }
      }
      return conv
    }).sort((a, b) => (b?.lastMessage?.sentAt || -Infinity) - (a?.lastMessage?.sentAt || -Infinity)))
  }, [])
  const handleCreateConv = (user: OtherUser) => {
    return async () => {
      const sendUser = {
        otherUser: {
          username: user.username,
          _id: user._id
        }
      }
      await requestCreateConv(sendUser)
      handleOnCloseModal()
    }
  }

  useEffect(() => {
    if (dataCreateConv !== null) {
      console.log(dataCreateConv)
      setAddConversation(prevState => ([...prevState, dataCreateConv]))
    }
  }, [dataCreateConv])

  useEffect(() => {
    if (gotNewMessage && !dataConversations.some(conv => conv._id === gotNewMessage.convId)) {
      requestNewConversation(gotNewMessage.convId)
    }
  }, [gotNewMessage])

  useEffect(() => {
    if (dataNewConversation !== null) {
      setAddConversation(prevState => ([dataNewConversation, ...prevState]))
    }
  }, [dataNewConversation])

  useEffect(() => {
    socket.current.connect()
    socket.current.emit("userConnected", {
      username: currentUser.username,
      userId: currentUser._id,
    })

    socket.current.on("connectedUsers", (users) => {
      setConnectedUsers(users)
    })

    socket.current.on("gotNewMessage", (message) => {
      setGotNewMessage(message)
      addLastMessageAndSortConversations(message.convId, message.newMessage)
    })
    return () => {
      socket.current.disconnect()
    }
  }, [])

  useEffect(() => {
    request()
  }, [])

  const logout = useLogout()

  const handleWindowHeight = windowWidth > 750 ? {} : { height: windowHeight }
  const handleWindowHeightlow = windowWidth < 750 ? {} : { height: windowHeight }
  if (isLoading) return <CustomLoader />

  return (
    <div
      className={styles.outerContainer}
      style={handleWindowHeightlow}>
      <div className={styles.styleBigScreen} />
      <div
        className={styles.container}
        style={handleWindowHeight}>
        {(!params.id || windowWidth >= 750) &&
          <div
            className={styles.leftSideContainer}>
            <div className={styles.actionsContainer}>
              <UserAvatar
                hasProfilePicture={!!currentUser.picture}
                pictureToShow={currentUser.picture || currentUser.username.slice(0, 2).toLocaleUpperCase()}
                isLoading={false}
              />
              <div>
                <button onClick={() => setOpenModal(true)}><MessageIcon /></button>
                <button onClick={logout}><LogoutIcon /></button>
              </div>
            </div>
            <Conversations
              connectedUsers={connectedUsers}
              dataConversations={dataConversations}
            />
            {openModal &&
              <UsersModal
                handleCreateConv={handleCreateConv}
                openModal={openModal}
                onCloseModal={handleOnCloseModal} />}
          </div>
        }
        {
          (!params.id && windowWidth >= 750)
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

export default memo(Chat)