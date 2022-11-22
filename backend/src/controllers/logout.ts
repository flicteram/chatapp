import { Request, Response } from "express";
// import CustomError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";
import User from '../models/user.js'

const handleLogout = async (req: Request, res: Response) => {
  if (!req?.cookies?.jwt) return res.sendStatus(StatusCodes.NO_CONTENT)
  const refreshToken = req.cookies.jwt
  const currentUser = await User.findOne({ refreshToken })
  if (!currentUser) {
    res.clearCookie('jwt', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    return res.sendStatus(StatusCodes.NO_CONTENT)
  }
  await currentUser.updateOne({ refreshToken: '' })
  res.clearCookie('jwt', {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  })
  return res.sendStatus(StatusCodes.OK)

}

export default handleLogout