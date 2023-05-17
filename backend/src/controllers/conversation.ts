import { Request, Response } from 'express'
import Conversation from '../models/conversation.js'
import User from '../models/user.js'
import GoogleUser from "../models/googleUser.js"
import CustomError from '../errors/customError.js'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

interface ParticipantUser {
  username: string,
  _id: string
}

const newConversation = async (req: Request, res: Response) => {

  if (!req?.body?.data?.otherUser._id || !req?.body?.data?.otherUser.username) {
    throw new CustomError("Please provide both _id and username", StatusCodes.BAD_REQUEST)
  }
  const [otherUserNormal, otherUserGoogle] = await Promise.all([
    User.findById(req.body.data.otherUser._id),
    GoogleUser.findById(req.body.data.otherUser._id)
  ])
  const otherUser = otherUserNormal || otherUserGoogle
  if (!otherUser || req.currentUser._id === req.body.data.otherUser._id) {
    throw new CustomError("Can not create conversation", StatusCodes.BAD_REQUEST)
  }
  const newConv = new Conversation({ participants: [req.currentUser, req.body.data.otherUser] })
  await Promise.all([
    otherUser.updateOne({
      $push: {
        conversations: {
          id: newConv._id,
          otherUserId: req.currentUser._id
        }
      }
    }),
    User.findByIdAndUpdate(req.currentUser._id, {
      $push: {
        conversations: {
          id: newConv._id,
          otherUserId: otherUser._id
        }
      }
    }),
    GoogleUser.findByIdAndUpdate(req.currentUser._id, {
      $push: {
        conversations: {
          id: newConv._id,
          otherUserId: otherUser._id
        }
      }
    })
  ])
  await newConv.save()
  res.status(StatusCodes.CREATED).json(newConv)
}

const newMessage = async (req: Request, res: Response) => {
  await Conversation.findOneAndUpdate({ _id: req.params.id }, {
    $push: { messages: req.body.data },
    lastMessage: req.body.data
  }, { returnDocument: 'after' })
  res.status(StatusCodes.CREATED).json(req.body.data)
}

const getConversation = async (req: Request, res: Response) => {

  if (req.params.id.length !== 24) {
    throw new CustomError("This conversation does not exist", StatusCodes.NOT_FOUND)
  }
  const conversation = await Conversation.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    { $limit: 1 },
    {
      $addFields:
      {
        totalMsgs: { $size: '$messages' },
        messages: {
          $slice: [
            { $reverseArray: "$messages" },
            0,
            Number(req.query.messagesCount)
          ]
        },
      }
    }
  ])
  if (!conversation.length) {
    throw new CustomError("This conversation does not exist", StatusCodes.NOT_FOUND)
  }
  const [conv] = conversation
  const isUserInParticipants = conv.participants.some((user: ParticipantUser) => user.username === req.currentUser.username)
  if (!isUserInParticipants) {
    throw new CustomError("Unable to get this conversation!", StatusCodes.FORBIDDEN)
  }
  res.status(StatusCodes.CREATED).json(conv)
}

const getConversationNew = async (req: Request, res: Response) => {
  const newConv = await Conversation.findById(req.params.id, '-messages')
  res.status(StatusCodes.OK).json(newConv)
}

const seenMessages = async (req: Request, res: Response) => {

  await Conversation.findOneAndUpdate({
    _id: req.params.id,
    "lastMessage.seen": false,
    "lastMessage.sentBy.username": { $ne: req.currentUser.username }
  }, {
    $set: {
      "messages.$[element].seen": true,
      "lastMessage.seen": true
    }
  }, {
    "arrayFilters": [
      { "element.sentBy.username": { $ne: req.currentUser.username } }
    ],
    returnDocument: "after"
  })

  res.status(StatusCodes.OK).json({ message: 'You have seen all messages!' })
}

export {
  newConversation, newMessage, getConversation, getConversationNew, seenMessages
}