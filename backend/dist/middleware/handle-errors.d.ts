import { Request, Response, NextFunction } from "express";
declare const handleErrors: (error: Error, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
export default handleErrors;
