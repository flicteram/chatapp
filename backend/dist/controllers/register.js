import CustomError from '../errors/customError.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
const handleRegister = async (req, res) => {
    const { username, password } = req.body.data;
    if (!username || !password) {
        throw new CustomError("All fields are required!", StatusCodes.NOT_ACCEPTABLE);
    }
    if (username.length > 20) {
        throw new CustomError("Username max length 20", StatusCodes.NOT_ACCEPTABLE);
    }
    const userExists = await UserModel.findOne({ username });
    if (userExists) {
        throw new CustomError("Username already exists", StatusCodes.CONFLICT);
    }
    const refreshToken = jwt.sign({ username }, process.env.SECRET_REFRESH_TOKEN, { expiresIn: "1d" });
    const userData = {
        ...req.body.data,
        refreshToken,
        lastLoggedIn: Date.now()
    };
    const user = new UserModel(userData);
    const hashedPass = await bcrypt.hash(password, 10);
    user.password = hashedPass;
    await user.save();
    const accessToken = jwt.sign({
        username,
        _id: user._id
    }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "5m" });
    res.status(StatusCodes.OK).json({
        accessToken,
        username: user.username,
        _id: user._id
    });
};
export default handleRegister;
