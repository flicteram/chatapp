import { Schema, model } from 'mongoose';
const googleUserSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    conversations: {
        type: [Map],
        default: []
    },
    refreshToken: {
        type: String,
        default: ''
    },
    lastLoggedIn: {
        type: Number,
        required: true,
    }
});
export default model('GoogleUser', googleUserSchema);
