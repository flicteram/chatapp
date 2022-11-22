import { Schema, model } from 'mongoose';
const conversationSchema = new Schema({
    messages: {
        type: [Map],
        default: Array
    },
    participants: {
        type: [Map],
        required: [true, "No participants sent"],
    },
    lastMessage: {
        type: Map,
        default: {}
    }
});
export default model('Conversation', conversationSchema);
