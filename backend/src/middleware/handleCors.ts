import { Request, Response, NextFunction } from "express"
export default function handleCors(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = ['http://localhost:3000', 'https://chatapp-frontend-ten.vercel.app/']
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin as string)) {
    res.setHeader('Access-Control-Allow-Origin', origin as string);
  }
  return next();

}