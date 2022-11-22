import CustomError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new CustomError("All fields are required!", StatusCodes.NOT_ACCEPTABLE);
    }
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
        throw new CustomError("User does not exist!", StatusCodes.NOT_FOUND);
    }
    const comparePasswords = await bcrypt.compare(password, currentUser.password);
    if (comparePasswords) {
        const accessToken = jwt.sign({ username }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "5m" });
        const refreshToken = jwt.sign({ username }, process.env.SECRET_REFRESH_TOKEN, { expiresIn: "1d" });
        await currentUser.updateOne({ refreshToken });
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(StatusCodes.OK).json({
            username: currentUser.username,
            id: currentUser.id,
            accessToken
        });
    }
    else {
        throw new CustomError("Passwords does not match!", StatusCodes.NOT_FOUND);
    }
};
export default handleLogin;
