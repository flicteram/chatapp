import { useState, useEffect } from 'react'
import Conversation from '@Interfaces/Conversation';

export default function useDates( messagesData:Conversation | null ){
  const [datesState, setDatesState] = useState<{
    [value: string]: number
  }>({})

  useEffect( () => {
    const dates: {
      [value: string]: number
    } = {}
    messagesData?.messages.forEach( ( m, index ) => {
      const date = new Date( m.sentAt ).toLocaleDateString( 'en-GB' )
      dates[date] = index
    })
    setDatesState( dates )
  }, [messagesData?.messages])

  return datesState
}