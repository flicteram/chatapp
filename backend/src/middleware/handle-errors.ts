import { Request, Response, NextFunction } from "express"
import CustomError from "../errors/customError.js"

const handleErrors = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error: Error, _req: Request, res: Response, _next: NextFunction
) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ message: error.message })
  }
  return res.status(500).json({ message: 'Server Error' })
}

export default handleErrors