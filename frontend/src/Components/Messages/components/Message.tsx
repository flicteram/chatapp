import useUserSelector from "../../User/useUserSelector"
import styles from '../Messages.module.css'
import SendMessage from '@Interfaces/SendMessage'
import { useMemo, useCallback, memo } from 'react'
import MessageRenderer from "./MessageRenderer"

interface Props{
  message: SendMessage,
  messagePosition: number,
  participantsNumber:number,
  handleMessageInfo:( message:SendMessage, isSelfMessage:boolean )=>()=>void,
  datesState:{
    [value: string]: number
  }
}

export default memo( function Message({
  message,
  messagePosition,
  datesState,
  participantsNumber,
  handleMessageInfo
}: Props ){
  const currentUser = useUserSelector()

  const getDate = useCallback( ( date: number ) => {
    return new Date( date ).toLocaleDateString( 'en-GB' )
  }, [])

  const isMessageByCurrentUser = message.sentBy._id === currentUser._id

  const showDate = useMemo( ()=>{
    return datesState[getDate( message.sentAt )] === messagePosition
  }, [datesState])

  return (
    <div
      className={styles.container}
      key={message.sentAt}
      style={{ alignItems: isMessageByCurrentUser ? 'flex-end' : 'flex-start' }}>
      { showDate &&
      <span
        className={styles.date}>
        {getDate( message.sentAt )}
      </span>
      }
      <MessageRenderer
        message={message}
        participantsNumber={participantsNumber}
        handleMessageInfo={handleMessageInfo}
        isMessageByCurrentUser={isMessageByCurrentUser}
      />
    </div>
  )
})