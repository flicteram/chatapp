import useLogout from "../../hooks/useLogout";
import { memo, useState, useEffect, useRef, useCallback } from 'react'
import UsersModal from "../../components/UsersModal/UsersModal";
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useGetConversations, useCreateConversation, useGetConversationNew } from "./ChatAPI";
import useUserSelector from '../../components/User/useUserSelector'
import Conv from '../../interfaces/Conversation'
import { io } from 'socket.io-client'
import ConnectedUser from "../../interfaces/ConnectedUser";
import GotNewMessage from "../../interfaces/GotNewMeessage";
import { User } from '../../interfaces/User'
import SendMessage from '../../interfaces/SendMessage'
import useWindowSize from "../../hooks/useWindowSize";
import styles from './Chat.module.css'
import Avatar from '@mui/material/Avatar';
import MessageIcon from '@mui/icons-material/Message';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomLoader from "../../components/CustomLoader/CustomLoader";

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

  const url = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/'

  const params = useParams()
  const socket = useRef(io(url, { autoConnect: false }))
  const windowWidth = useWindowSize()

  const navigate = useNavigate()
  const currentUser = useUserSelector()
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [gotNewMessage, setGotNewMessage] = useState<GotNewMessage | null>(null)
  const handleOnCloseModal = () => {
    setOpenModal(false)
  }
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
  const addLastMessageAndSortConversations = (sendToId: string, message: SendMessage) => {
    setAddConversation(prevState => prevState.map(conv => {
      if (conv._id === sendToId) {
        return {
          ...conv,
          lastMessage: message
        }
      }
      return conv
    }).sort((a, b) => b?.lastMessage?.sentAt - a?.lastMessage?.sentAt))
  }
  const handleCreateConv = (user: User) => {
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

  const handleDate = (sentAt: number) => {
    const date = new Date(sentAt)
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric'
      })
    }
    if (date.toLocaleDateString('en-GB') === "Invalid Date") {
      return ''
    }
    return date.toLocaleDateString('en-GB')
  }
  const handleDisplayConversations = () => {
    if (!dataConversations.length) {
      return <h3>No conversations</h3>
    }
    const handleClickConversation = (convId: string) => {
      return () => {
        navigate(convId)
      }
    }

    const conversations: JSX.Element[] = [];

    dataConversations.forEach((conv: Conv) => {
      const participant = conv.participants.find(i => i.username !== currentUser.username)?.username
      const isUserOnline = connectedUsers.some(u => u?.username === participant)
      conversations.push(
        <button
          className={styles.convContainer}
          key={conv._id}
          onClick={handleClickConversation(conv._id)}
          style={conv._id === params.id ? { background: 'var(--gray)' } : {}}
        >
          <div className={styles.profilePicContainer}>
            <Avatar
              sx={{
                width: '55px',
                height: '55px'
              }} />
            <div
              className={styles.statusProfile}
              style={{ display: isUserOnline ? "unset" : "none" }} />
          </div>
          <div className={styles.convLeftContainer}>
            <div className={styles.convLeft}>
              <div className={styles.convLeftInfo}>
                <h3>{participant}</h3>
                {conv?.lastMessage.sentBy &&
                  <span>
                    {conv.lastMessage.message}
                  </span>
                }
              </div>
              <div className={styles.convRight}>
                <span>{handleDate(conv.lastMessage.sentAt)}</span>
                <span
                  className={styles.newMessage}
                  style={(conv?.lastMessage?.sentBy?.username !== currentUser.username)
                    &&
                    conv?.lastMessage?.seen === false ? { display: "unset" } : { display: 'none' }
                  }
                />
              </div>
            </div>
          </div>

        </button>
      )
    })

    return conversations
  }

  useEffect(() => {
    if (dataCreateConv !== null) {
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

  if (isLoading) return <CustomLoader />

  return (
    <div className={styles.outerContainer}>
      <div className={styles.styleBigScreen} />
      <div className={styles.container}>
        {(!params.id || windowWidth >= 750) &&
          <div
            className={styles.leftSideContainer}>
            <div className={styles.actionsContainer}>
              <Avatar />
              <div>
                <button onClick={() => setOpenModal(true)}><MessageIcon /></button>
                <button onClick={logout}><LogoutIcon /></button>
              </div>
            </div>
            <div className={styles.convsContainer}>
              {handleDisplayConversations()}
            </div>
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
            connectedUsers
          }} />
      </div>
    </div>

  )
}

export default memo(Chat)