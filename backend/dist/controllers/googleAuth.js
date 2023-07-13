import CustomError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";
import GoogleUser from "../models/googleUser.js";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
const handleGoogleLogin = async (req, res) => {
    const googleToken = req.body.data;
    if (!googleToken) {
        throw new CustomError("No token provided", StatusCodes.NOT_ACCEPTABLE);
    }
    const googleAccountInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`);
    if (!googleAccountInfo) {
        throw new CustomError("Invalid token!", StatusCodes.FORBIDDEN);
    }
    const { email, picture } = googleAccountInfo.data;
    const username = email.split("@")[0];
    let googleUser = await GoogleUser.findOne({ username });
    const refreshToken = jwt.sign({ username }, process.env.SECRET_REFRESH_TOKEN, { expiresIn: "1d" });
    if (!googleUser) {
        googleUser = await GoogleUser.create({
            lastLoggedIn: Date.now(),
            username,
            email,
            picture,
            refreshToken
        });
    }
    const accessToken = jwt.sign({
        username,
        _id: googleUser._id
    }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "5m" });
    await googleUser.updateOne({ refreshToken });
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'strict',
    });
    return res.status(StatusCodes.OK).json({
        username: googleUser.username,
        _id: googleUser._id,
        accessToken,
        picture
    });
};
export default handleGoogleLogin;
