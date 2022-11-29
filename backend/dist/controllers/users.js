import User from '../models/user.js';
import Conversation from '../models/conversation.js';
const getUsers = async (req, res) => {
    // Check for existing conversations
    const currentUserConversations = await Conversation.find({ participants: { $elemMatch: { _id: req?.currentUser._id } } });
    const excludeUsers = new Set();
    if (currentUserConversations.length) {
        // if there are any existing conversations exclude users that already have a conversation with
        currentUserConversations.map(conv => conv.participants.map(i => excludeUsers.add(i.get('username'))));
    }
    excludeUsers.add(req.currentUser.username);
    const allUsers = await User.find({ username: { $nin: [...excludeUsers] } }, ['-refreshToken', '-password']);
    return res.json(allUsers);
};
const getOtherUser = async (req, res) => {
    const user = await User.findById(req.params.id, ['-refreshToken', '-password']);
    return res.json(user);
};
const updateUserDisconnect = async (disconnectedUser) => {
    await User.findByIdAndUpdate(disconnectedUser.userId, { lastLoggedIn: Date.now() }, { returnDocument: "after" });
    return "Disconnected!";
};
export { getUsers, updateUserDisconnect, getOtherUser };
