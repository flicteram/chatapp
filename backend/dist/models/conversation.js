import { Schema, model } from 'mongoose';
const conversationSchema = new Schema({
    messages: {
        type: [Map],
        default: Array
    },
    participants: {
        type: [String],
        required: [true, "No participants sent"],
    },
    lastMessage: {
        type: Map,
        default: {}
    },
    groupName: {
        type: String,
        default: ""
    }
});
export default model('Conversation', conversationSchema);
