import { useEffect } from 'react'
import { useCreateConversation, ICreateConversation } from '../ChatAPI'
import MultipleConvs from '../../../interfaces/MulltipleConvs';

export default function useCreateConv(
  handleToggleModal:()=>void,
  handleAddCreatedConversation:( convData:MultipleConvs )=>void
){
  const {
    dataCreateConv,
    requestCreateConv
  } = useCreateConversation()

  const handleCreateConv = async ( data: ICreateConversation ) => {
    await requestCreateConv( data )
    handleToggleModal()
  }
  useEffect( () => {
    if ( dataCreateConv !== null ) {
      handleAddCreatedConversation( dataCreateConv )
    }
  }, [dataCreateConv])

  return handleCreateConv
}