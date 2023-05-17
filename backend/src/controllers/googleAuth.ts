import { Request, Response } from "express";
import CustomError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";
import GoogleUser from "../models/googleUser.js";
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import axios from 'axios'

interface GoogleAccount {
  email: string,
  picture: string
}

dotenv.config()

const handleGoogleLogin = async (req: Request, res: Response) => {
  const googleToken = req.body.data;
  if (!googleToken) {
    throw new CustomError("No token provided", StatusCodes.NOT_ACCEPTABLE)
  }
  const googleAccountInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`)
  if (!googleAccountInfo){
    throw new CustomError("Invalid token!", StatusCodes.FORBIDDEN)
  }
  const {
    email, picture
  } = googleAccountInfo.data as GoogleAccount

  const username = email.split("@")[0]
  let googleUser = await GoogleUser.findOne({ username })
  const refreshToken = jwt.sign({ username },
    process.env.SECRET_REFRESH_TOKEN as string,
    { expiresIn: "1d" })

  if (!googleUser){
    googleUser = await GoogleUser.create({
      lastLoggedIn: Date.now(),
      username: email.split("@")[0],
      email,
      picture,
      refreshToken
    })
  }
  const accessToken = jwt.sign({
    username,
    _id: googleUser._id
  }, process.env.SECRET_ACCESS_TOKEN as string, { expiresIn: "5m" })

  await googleUser.updateOne({ refreshToken })
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: 'none',
  })
  console.log('gg', googleUser)
  return res.status(StatusCodes.OK).json({
    username: googleUser.username,
    _id: googleUser._id,
    accessToken,
    picture
  })
}

export default handleGoogleLogin