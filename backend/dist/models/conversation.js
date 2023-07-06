import { Schema, model } from 'mongoose';
const conversationSchema = new Schema({
    messages: {
        type: [{
                message: String,
                seenByIds: [String],
                seenBy: [{
                        username: String,
                        seenAt: Number,
                        _id: String
                    }],
                sentAt: Number,
                sentBy: {
                    username: String,
                    _id: String
                }
            }],
        default: Array
    },
    participants: {
        type: [String],
        required: [true, "No participants sent"],
    },
    lastMessage: {
        type: {
            message: String,
            seenByIds: [String],
            seenBy: [{
                    username: String,
                    seenAt: Number,
                    _id: String
                }],
            sentAt: Number,
            sentBy: {
                username: String,
                _id: String
            }
        },
        default: {}
    },
    groupName: {
        type: String,
        default: ""
    }
});
export default model('Conversation', conversationSchema);
