import { memo, useState, useRef, useEffect } from 'react'
import styles from './MessageInput.module.css'
import SendIcon from '@mui/icons-material/Send';
interface Props {
  handleSendMessage: (msg: string) => Promise<void>,
  sendMessageLoading: boolean
}

function MessageInput({
  handleSendMessage, sendMessageLoading
}: Props) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }
  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (message.length > 0) {
      handleSendMessage(message)
      setMessage('')
      inputRef.current?.focus()
    }
  }
  const placeholder = sendMessageLoading ? "Sending message..." : "Type a message"
  useEffect(() => {
    inputRef.current?.focus()
  }, [sendMessageLoading])
  return (
    <form
      onSubmit={submit}
      className={styles.container}>
      <input
        disabled={sendMessageLoading}
        ref={inputRef}
        placeholder={placeholder}
        value={message}
        onChange={handleMessageChange} />
      <button
        type='submit'
        disabled={!message.length}>
        <SendIcon />
      </button>
    </form>

  )
}

export default memo(MessageInput)