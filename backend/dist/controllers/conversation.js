import Conversation from '../models/conversation.js';
import User from '../models/user.js';
import GoogleUser from "../models/googleUser.js";
import CustomError from '../errors/customError.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
const addConvId = (convId, userId) => ({
    id: convId,
    otherUsersIds: userId
});
const idsExceptSelf = (data, currentUserId) => (data.filter((id) => id !== currentUserId));
const updateUserConversation = (convId, data, currentUserId) => {
    return addConvId(convId, idsExceptSelf(data, currentUserId));
};
const newConversation = async (req, res) => {
    if (!req.body.data.usersIds.length) {
        throw new CustomError("Please provide users ids", StatusCodes.BAD_REQUEST);
    }
    const { groupName, usersIds } = req.body.data;
    if (usersIds.length > 1 && !groupName) {
        throw new CustomError("Please provide group name", StatusCodes.BAD_REQUEST);
    }
    const allUsers = await Promise.all([
        User.find({ "_id": { "$in": usersIds } }, '-password -refreshToken -conversations'),
        GoogleUser.find({ "_id": { "$in": usersIds } }, '-password -refreshToken -conversations')
    ]).then(([normalUsers, googleUsers]) => [...normalUsers, ...googleUsers]);
    if (!allUsers.length) {
        throw new CustomError("Can not create conversation", StatusCodes.BAD_REQUEST);
    }
    const newConv = new Conversation({
        participants: [req.currentUser._id, ...usersIds],
        groupName
    });
    await Promise.all([
        ...allUsers.map(user => user.updateOne({ $push: { conversations: updateUserConversation(newConv._id.toString(), [req.currentUser._id, ...usersIds], user._id.toString()) } })),
        User.findByIdAndUpdate(req.currentUser._id, { $push: { conversations: addConvId(newConv._id.toString(), usersIds) } }),
        GoogleUser.findByIdAndUpdate(req.currentUser._id, { $push: { conversations: addConvId(newConv._id.toString(), usersIds) } })
    ]);
    await newConv.save();
    const returnedConv = {
        ...newConv.toObject(),
        participants: allUsers
    };
    res.status(StatusCodes.CREATED).json(returnedConv);
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
                        Number(req.query.messagesCount),
                        20
                    ]
                },
            }
        }
    ]);
    if (!conversation.length) {
        throw new CustomError("This conversation does not exist", StatusCodes.NOT_FOUND);
    }
    const [conv] = conversation;
    const isUserInParticipants = conv.participants.some((userId) => userId === req.currentUser._id);
    if (!isUserInParticipants) {
        throw new CustomError("Unable to get this conversation!", StatusCodes.FORBIDDEN);
    }
    res.status(StatusCodes.CREATED).json(conv);
};
const getConversationNew = async (req, res) => {
    const newConv = await Conversation.findById(req.params.id, '-messages');
    const participantsIds = newConv?.participants.filter(id => id !== req.currentUser._id);
    const participantsData = await Promise.all([
        User.find({ "_id": { "$in": participantsIds } }, '-password -refreshToken -conversations'),
        GoogleUser.find({ "_id": { "$in": participantsIds } }, '-password -refreshToken -conversations')
    ]);
    const convWithUsersData = {
        ...newConv?.toObject(),
        lastMessage: newConv?.lastMessage,
        participants: participantsData.flat(1),
    };
    res.status(StatusCodes.OK).json(convWithUsersData);
};
const seenMessages = async (req, res) => {
    await Conversation.findOneAndUpdate({
        _id: req.params.id,
        "lastMessage.sentBy.username": { $ne: req.currentUser.username },
        "lastMessage.seenByIds": { $ne: req.currentUser._id }
    }, {
        $addToSet: {
            "messages.$[element].seenByIds": req.currentUser._id,
            "messages.$[element].seenBy": {
                _id: req.currentUser._id,
                username: req.currentUser.username,
                seenAt: Date.now()
            },
            "lastMessage.seenBy": {
                _id: req.currentUser._id,
                username: req.currentUser.username,
                seenAt: Date.now()
            },
            "lastMessage.seenByIds": req.currentUser._id
        }
    }, {
        "arrayFilters": [
            {
                "element.sentBy.username": { $ne: req.currentUser.username },
                "element.seenByIds": { $ne: req.currentUser._id }
            }
        ]
    });
    res.status(StatusCodes.OK).json({ message: 'You have seen all messages!' });
};
export { newConversation, newMessage, getConversation, getConversationNew, seenMessages };
