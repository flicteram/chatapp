import { memo, useState, useRef, useEffect } from 'react'
import styles from './MessageInput.module.css'
import SendIcon from '@mui/icons-material/Send';
interface Props {
  handleSendMessage: (msg: string) => Promise<void>
}

function MessageInput({ handleSendMessage }: Props) {
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
  useEffect(() => {
    inputRef.current?.focus()

  }, [])
  return (
    <form
      onSubmit={submit}
      className={styles.container}>
      <input
        ref={inputRef}
        placeholder='Type a message'
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