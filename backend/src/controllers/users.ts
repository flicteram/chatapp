import { Response, Request } from "express";
import User from '../models/user.js'
import GoogleUser from "../models/googleUser.js";
import ConnectedUser from "../interfaces/connectedUser.js";

const getUsers = async ( req: Request, res: Response ) => {
  // Check for existing conversations
  // const currentUserConversations = await Conversation.find({ participants: { $elemMatch: { _id: req?.currentUser._id } } })
  const excludeUsers = new Set()
  // if (currentUserConversations.length) {
  // if there are any existing conversations exclude users that already have a conversation with
  // currentUserConversations.map(conv => conv.participants.map(i => excludeUsers.add(i.get('username'))))
  // }
  excludeUsers.add( req.currentUser.username )
  const [normalUser, googleUser] = await Promise.all([
    User.find({ username: { $nin: [...excludeUsers] } }, ['-refreshToken', '-password']),
    GoogleUser.find({ username: { $nin: [...excludeUsers] } }, '-refreshToken' )
  ])
  return res.json([
    ...normalUser,
    ...googleUser
  ])
}

const getOtherUser = async ( req: Request, res: Response ) => {

  const dbUsers = await Promise.all([
    User.find({ _id: req.body.data }, ['-password', '-refreshToken', '-conversations']),
    GoogleUser.find({ _id: req.body.data }, ['-refreshToken', '-conversations'])
  ])

  return res.json( dbUsers.flat( 1 ) )
}

const updateUserDisconnect = async ( disconnectedUser: ConnectedUser ) => {
  await Promise.all([
    GoogleUser.findByIdAndUpdate( disconnectedUser.userId, { lastLoggedIn: Date.now() }, { returnDocument: "after" }),
    User.findByIdAndUpdate( disconnectedUser.userId, { lastLoggedIn: Date.now() }, { returnDocument: "after" })
  ])
  return "Disconnected!"
}

export {
  getUsers, updateUserDisconnect, getOtherUser
}