import { TypedUseSelectorHook, useSelector } from 'react-redux'
import type { RootState } from '../../utils/store'

export default function useUserSelector() {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  const userState = useAppSelector(state => state.user.user)

  return userState
}