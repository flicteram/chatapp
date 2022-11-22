import { Request, Response } from "express";
declare const handleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export default handleLogin;
