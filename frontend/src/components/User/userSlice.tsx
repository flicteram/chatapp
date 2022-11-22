import { createSlice } from '@reduxjs/toolkit'
import IUser from '../../interfaces/User'

const initialState: IUser = {
  user: {
    accessToken: '',
    username: '',
    _id: ''
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authUser: (state, action) => {
      state.user = action.payload
    },
    refreshUser: (state, action) => {
      state.user.accessToken = action.payload
    },
    logoutUser: (state) => {
      state.user = initialState.user
    }
  }
})

export const {
  authUser, logoutUser, refreshUser
} = userSlice.actions

export default userSlice.reducer