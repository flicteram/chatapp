import { useState, useCallback } from 'react'
import useInterceptor from '../../hooks/useInterceptor'
import Conv from '../../interfaces/Conversation';
import { useNavigate } from 'react-router-dom';
import CustomAxiosError from '../../interfaces/CustomAxiosError';
import SendMessage from '../../interfaces/SendMessage';
import Conversation from '../../interfaces/Conversation';
import useUserSelector from '../../components/User/useUserSelector';
import { useParams } from 'react-router-dom';

function useGetConversations() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Conv[]>([]);
  const [error, setError] = useState('');
  const axios = useInterceptor();
  const currentUser = useUserSelector()
  const params = useParams()

  async function request(controller?: AbortController) {
    setIsLoading(true)
    setError('')
    setData([])
    try {
      const response = await axios.get('/conversations', { signal: controller?.signal })
      setData(response.data)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e?.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCreatedConversation = (convData:Conv) => {
    setData(prevState => ([...prevState, convData]))
  }

  const addLastMessageAndSortConversations = useCallback((sendToId: string, message: SendMessage) => {
    setData(prevState => prevState.map(conv => {
      if (conv._id === sendToId) {
        return {
          ...conv,
          lastMessage: message
        }
      }
      return conv
    }).sort((a, b) => (b?.lastMessage?.sentAt || -Infinity) - (a?.lastMessage?.sentAt || -Infinity)))
  }, [])

  const handleAddNewConversation =(dataNewConversation:Conv) =>{
    setData(prevState => ([dataNewConversation, ...prevState]))
  }

  const handleMakeMessagesSeen = ()=>{
    setData(prevState => prevState.map(conv => {
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

  return {
    isLoading,
    dataConversations: data,
    error,
    request,
    handleAddCreatedConversation,
    addLastMessageAndSortConversations,
    handleAddNewConversation,
    setAddConversation: setData,
    handleMakeMessagesSeen
  }
}

interface Payload {
  otherUser: {
    username: string,
    _id: string
  }
}

function useCreateConversation() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Conv | null>(null);
  const [error, setError] = useState('');
  const axios = useInterceptor();

  async function request(payload: Payload) {
    setIsLoading(true)
    setError('')
    setData(null)
    try {
      const response = await axios.post('/conversation', { data: payload })
      setData(response.data)
      navigate(response.data._id)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e?.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    loadingCreateConv: isLoading,
    dataCreateConv: data,
    errorCreateConv: error,
    requestCreateConv: request,
  }
}

function useGetConversationNew() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Conversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const axios = useInterceptor();

  async function request(convId: string, controller?: AbortController) {
    setError(null)
    try {
      const response = await axios.get(`/conversation/new/${convId}`,
        { signal: controller?.signal })
      setData(response.data)
    } catch (e: unknown) {
      const err = e as CustomAxiosError
      setError(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }
  return {
    isLoading,
    dataNewConversation: data,
    error,
    requestNewConversation: request,
  }
}

export {
  useGetConversations, useCreateConversation, useGetConversationNew
}