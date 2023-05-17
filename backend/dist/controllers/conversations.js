import Conversation from '../models/conversation.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.js';
import GoogleUser from '../models/googleUser.js';
const getConversations = async (req, res) => {
    const [normalUser, googleUser] = await Promise.all([
        User.findById(req.currentUser._id),
        GoogleUser.findById(req.currentUser._id)
    ]);
    const currentUser = normalUser || googleUser;
    const participantsId = [];
    const conversationsIds = currentUser?.conversations.map(c => {
        participantsId.push(c.get('otherUserId'));
        return c.get('id');
    });
    const myConvs = await Conversation.find({ _id: { $in: conversationsIds } }, '-messages').sort("-lastMessage.sentAt");
    // Get all users that match the ids
    const dbUsers = await Promise.all([
        User.find({ _id: participantsId }, ['-password', '-refreshToken', '-conversations']),
        GoogleUser.find({ _id: participantsId }, ['-password', '-refreshToken', '-conversations'])
    ]);
    // Create map with user-id + user-data
    // In order to make it faster when searching in returendConv
    const users = new Map();
    dbUsers.flat().forEach((user) => {
        users.set(user._id.toString(), user);
    });
    // Add user data based on id to each
    const returnedConvs = myConvs.map(conv => {
        const participants = [];
        conv.participants.forEach(p => {
            const currentParticipant = users.get(p.get('_id'));
            if (!currentParticipant) {
                return;
            }
            if (currentParticipant?._id !== currentUser?._id) {
                participants.push(currentParticipant);
            }
        });
        return {
            ...conv.toJSON(),
            participants
        };
    });
    res.status(StatusCodes.OK).json(returnedConvs);
};
export { getConversations };
