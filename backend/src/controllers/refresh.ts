import { Request, Response } from "express";
import CustomError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.js";
import GoogleUser from "../models/googleUser.js";
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

const handleRefresh = async ( req: Request, res: Response ) => {
  if ( !req?.cookies?.jwt ) {
    throw new CustomError( "Unauthorized", StatusCodes.UNAUTHORIZED );
  }
  const refreshToken = req.cookies.jwt

  const [user, googleUser] = await Promise.all([
    User.findOne({ refreshToken }),
    GoogleUser.findOne({ refreshToken })
  ])
  const currentUser = user || googleUser
  if ( !currentUser ) {
    throw new CustomError( "Forbidden", StatusCodes.FORBIDDEN );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jwt.verify( refreshToken, process.env.SECRET_REFRESH_TOKEN as string, ( err: any, decoded: any ) => {
    if ( err || decoded.username !== currentUser.username ) {
      throw new CustomError( "Forbidden", StatusCodes.FORBIDDEN );
    }
  })
  // Generate another token
  const accessToken = jwt.sign({
    username: currentUser.username,
    _id: currentUser._id,
  }, process.env.SECRET_ACCESS_TOKEN as string, { expiresIn: '5m' });
  res.status( StatusCodes.OK ).json({
    username: currentUser.username,
    _id: currentUser._id,
    picture: googleUser?.picture,
    accessToken
  })

}

export default handleRefresh