import { Request, Response } from "express";
declare const handleGoogleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export default handleGoogleLogin;
