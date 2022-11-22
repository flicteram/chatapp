import Conversation from '../models/conversation.js';
import User from '../models/user.js';
import CustomError from '../errors/customError.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
const newConversation = async (req, res) => {
    if (!req?.body?.data?.otherUser._id || !req?.body?.data?.otherUser.username) {
        throw new CustomError("Please provide both _id and username", StatusCodes.BAD_REQUEST);
    }
    const otherUser = await User.findById(req.body.data.otherUser._id);
    if (!otherUser || req.currentUser._id === req.body.data.otherUser._id) {
        throw new CustomError("Can not create conversation", StatusCodes.BAD_REQUEST);
    }
    const newConv = new Conversation({ participants: [req.currentUser, req.body.data.otherUser] });
    await newConv.save();
    res.status(StatusCodes.CREATED).json(newConv);
};
const newMessage = async (req, res) => {
    await Conversation.findOneAndUpdate({ _id: req.params.id }, {
        $push: { messages: req.body.data },
        lastMessage: req.body.data
    }, { returnDocument: 'after' });
    res.status(StatusCodes.CREATED).json(req.body.data);
};
const getConversation = async (req, res) => {
    if (req.params.id.length !== 24) {
        throw new CustomError("This conversation does not exist", StatusCodes.NOT_FOUND);
    }
    const conversation = await Conversation.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        { $limit: 1 },
        {
            $addFields: {
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
    ]);
    if (!conversation.length) {
        throw new CustomError("This conversation does not exist", StatusCodes.NOT_FOUND);
    }
    const [conv] = conversation;
    const isUserInParticipants = conv.participants.some((user) => user.username === req.currentUser.username);
    if (!isUserInParticipants) {
        throw new CustomError("Unable to get this conversation!", StatusCodes.FORBIDDEN);
    }
    res.status(StatusCodes.CREATED).json(conv);
};
const getConversationNew = async (req, res) => {
    const newConv = await Conversation.findById(req.params.id, '-messages');
    res.status(StatusCodes.OK).json(newConv);
};
const seenMessages = async (req, res) => {
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
    });
    res.status(StatusCodes.OK).json({ message: 'You have seen all messages!' });
};
export { newConversation, newMessage, getConversation, getConversationNew, seenMessages };
