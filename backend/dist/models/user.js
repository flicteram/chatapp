import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true
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
export default model('User', userSchema);
