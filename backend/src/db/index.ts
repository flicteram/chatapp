import { connect } from 'mongoose';
const connectDB = async (url: string) => {
  return connect(url)
}

export default connectDB