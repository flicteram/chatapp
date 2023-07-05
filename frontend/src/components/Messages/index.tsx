import { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'
import Conversation from '../../interfaces/Conversation';
import useUserSelector from '../User/useUserSelector';
import { useParams } from 'react-router-dom'
import { useSeenMessage } from './MessagesApi'
import SendMessage from '../../interfaces/SendMessage'
import GotNewMessages from '../../interfaces/GotNewMeessage'
import PendingMessage from '../PendingMessage';
import Message from './Message';
import useDates from './hooks/useDates';
import GotSeenMessage from '../../interfaces/GotSeenMessage';
import Dialog from '@mui/material/Dialog'
import IOtherUser from '../../interfaces/OtherUser'
import OtherUser from '../OtherUser';
import MessageRendererModal from './MessageRendererModal';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import styles from './Messages.module.css'

interface Props {
  socket: {
    current: Socket
  }
  data: Conversation | null,
  gotNewMessage: GotNewMessages,
  makeMessagesSeen: ( seenMessage:GotSeenMessage )=>void,
  handleSeenLastMessage: () => void,
  pendingMessage: SendMessage | null,
  convUsersData: IOtherUser[],
  otherUsersIds?: string[],
}

export interface MessageInfo extends Omit<SendMessage, "seenBy"> {
  seenBy: IOtherUser[]
}

export default function Messages(
  {
    socket,
    data,
    handleSeenLastMessage,
    gotNewMessage,
    pendingMessage,
    makeMessagesSeen,
    otherUsersIds,
    convUsersData
  }: Props
) {
  const currentUser = useUserSelector()
  const { id: convId } = useParams()
  const [seenMsg, setSeenMsg] = useState( null );
  const [messageInfo, setMessageInfo] = useState<MessageInfo>({} as MessageInfo )
  const [isDialogOpen, setIsDialogOpen] = useState( false )
  const toggleDialog = () => setIsDialogOpen( prev=>!prev )
  const handleMessageInfo = ( messageInfo:SendMessage | MessageInfo, isSelfMessage:boolean ) => {
    return () =>{
      if( data?.participants && data.participants.length>2 && isSelfMessage ){
        const seenByUsers = {
          ...messageInfo,
          seenBy: messageInfo.seenBy.map( seenUser=>convUsersData.find( u=>u.username===seenUser )  as IOtherUser )
        }
        setMessageInfo( seenByUsers )
        toggleDialog()
      }
    }
  }
  const { seenMessageRequest } = useSeenMessage()
  const datesState = useDates( data )
  useEffect( () => {
    socket.current.on( 'gotSeenMessages', ( seenMsgData ) => {
      if ( seenMsgData.convId === convId ) {
        setSeenMsg( seenMsgData )
      }
    })
    return () => {
      socket.current.off( "gotSeenMessages" )
    }
  }, [])

  useEffect( () => {
    if ( seenMsg !== null ) {
      makeMessagesSeen( seenMsg )
    }
  }, [seenMsg])

  useEffect( () => {
    if ( data?.messages.length ) {
      seenMessageRequest()
      socket.current.emit( "seenMessages", {
        seenBy: currentUser.username,
        seenToId: otherUsersIds,
        convId: convId
      })
      handleSeenLastMessage()
    }
    return () => {
      socket.current.off( "seenMessages" )
    }
  }, [gotNewMessage])

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1em',
            maxWidth: '400px',
            gap: '1em'
          }}>
          <MessageRendererModal
            message={messageInfo}
            participantsNumber={data?.participants ? data?.participants.length-1 : 0}
          />
          <div className={styles.seenByContainer}>
            <h3>Seen by</h3>
            <DoneAllIcon color="primary"/>
          </div>
          {messageInfo?.seenBy?.length ?
            messageInfo.seenBy.map( user=>(
              <div
                style={{
                  display: 'flex',
                  gap: '.5em',
                }}
                key={user._id}>
                <OtherUser
                  isUserLoading={false}
                  otherUserData={user}
                  key={user._id}
                />
              </div>
            ) )
            :
            <h3>No one saw the message yet</h3>
          }
        </div>
      </Dialog>
      <PendingMessage pendingMessage={pendingMessage}/>
      {data?.messages?.map( ( m, index ) => (
        <Message
          handleMessageInfo={handleMessageInfo}
          participantsNumber={data.participants.length-1}
          datesState={datesState}
          message={m}
          messagePosition={index}
          key={m.sentAt}/>
      ) )}
    </>
  )
}