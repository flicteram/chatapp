import Conversation from '../models/conversation.js';
import { StatusCodes } from 'http-status-codes';
const getConversations = async (req, res) => {
    const myConvs = await Conversation.find({ participants: { $elemMatch: { _id: req?.currentUser._id } } }, '-messages').sort("-lastMessage.sentAt");
    res.status(StatusCodes.OK).json(myConvs);
};
export { getConversations };
