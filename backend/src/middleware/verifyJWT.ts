import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { Request, NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import CustomError from '../errors/customError.js'

dotenv.config()

interface Token {
  username: string,
  _id: string
}

const handleVerifyToken = ( req: Request, _res: Response, next: NextFunction ) => {
  const authHeader = req.headers.authorization
  if ( !authHeader ) {
    throw new CustomError( 'Token not provided!', StatusCodes.FORBIDDEN )
  }
  const token = authHeader.split( ' ' )[1]
  jwt.verify( token, process.env.SECRET_ACCESS_TOKEN as string, ( err ) => {
    if ( err ) {
      throw new CustomError( 'Forbidden!', StatusCodes.FORBIDDEN )
    }
  })
  const decoded = jwt.decode( token ) as Token
  req.currentUser = {
    username: decoded?.username,
    _id: decoded?._id
  }
  next()
}

export default handleVerifyToken