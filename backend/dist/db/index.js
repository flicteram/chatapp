import { connect } from 'mongoose';
const connectDB = async (url) => {
    return connect(url);
};
export default connectDB;
