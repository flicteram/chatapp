// import CustomError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";
import User from '../models/user.js';
import GoogleUser from '../models/googleUser.js';
const handleLogout = async (req, res) => {
    if (!req?.cookies?.jwt)
        return res.sendStatus(StatusCodes.NO_CONTENT);
    const refreshToken = req.cookies.jwt;
    const [normalUser, googleUser] = await Promise.all([
        User.findOne({ refreshToken }),
        GoogleUser.findOne({ refreshToken })
    ]);
    const currentUser = normalUser || googleUser;
    if (!currentUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
    await currentUser.updateOne({ refreshToken: '' });
    res.clearCookie('jwt', {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    return res.sendStatus(StatusCodes.OK);
};
export default handleLogout;
