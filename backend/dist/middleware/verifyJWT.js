import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors/customError.js';
dotenv.config();
const handleVerifyToken = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new CustomError('Token not provided!', StatusCodes.FORBIDDEN);
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err) => {
        if (err) {
            throw new CustomError('Forbidden!', StatusCodes.FORBIDDEN);
        }
    });
    const decoded = jwt.decode(token);
    req.currentUser = {
        username: decoded?.username,
        _id: decoded?._id
    };
    next();
};
export default handleVerifyToken;
