import CustomError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
const handleRefresh = async (req, res) => {
    if (!req?.cookies?.jwt) {
        throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }
    const refreshToken = req.cookies.jwt;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new CustomError("Forbidden", StatusCodes.FORBIDDEN);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, decoded) => {
        if (err || decoded.username !== user.username) {
            throw new CustomError("Forbidden", StatusCodes.FORBIDDEN);
        }
    });
    // Generate another token
    const accessToken = jwt.sign({
        username: user.username,
        _id: user._id
    }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '5m' });
    res.status(StatusCodes.OK).json({
        username: user.username,
        _id: user._id,
        accessToken
    });
};
export default handleRefresh;
