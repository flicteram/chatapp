import { Request, Response } from "express";
declare const handleLogout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export default handleLogout;
