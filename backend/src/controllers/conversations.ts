import { Request, Response } from 'express'
import Conversation from '../models/conversation.js'
import { StatusCodes } from 'http-status-codes'
import User, { IUser } from '../models/user.js'
import GoogleUser, { IUserGoogle } from '../models/googleUser.js'

const getConversations = async (req: Request, res: Response) => {

  const [normalUser, googleUser] = await Promise.all([
    User.findById(req.currentUser._id),
    GoogleUser.findById(req.currentUser._id)
  ])
  const currentUser = normalUser || googleUser

  const participantsId: string[] = []
  const conversationsIds = currentUser?.conversations.map(c=>{
    participantsId.push(c.get('otherUserId') as string)
    return c.get('id')
  })
  const myConvs = await Conversation.find({ _id: { $in: conversationsIds } }, '-messages').sort("-lastMessage.sentAt")

  // Get all users that match the ids
  const dbUsers = await Promise.all([
    User.find({ _id: participantsId }, ['-password', '-refreshToken', '-conversations']),
    GoogleUser.find({ _id: participantsId }, ['-password', '-refreshToken', '-conversations'])
  ])

  // Create map with user-id + user-data
  // In order to make it faster when searching in returendConv
  const users = new Map()
  dbUsers.flat().forEach((user)=>{
    users.set(user._id.toString(), user)
  })
  // Add user data based on id to each
  const returnedConvs = myConvs.map(conv=>{
    const participants: IUser | IUserGoogle[] = [];
    conv.participants.forEach(p=>{
      if(p.get('_id') === currentUser?._id.toString()){
        return
      }
      const currentParticipant = users.get(p.get('_id'))
      participants.push(currentParticipant)
    })
    return{
      ...conv.toJSON(),
      participants
    }
  })
  res.status(StatusCodes.OK).json(returnedConvs)
}

export { getConversations }
