import { Response, Request } from "express";
import ConnectedUser from "../interfaces/connectedUser.js";
declare const getUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const getOtherUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const updateUserDisconnect: (disconnectedUser: ConnectedUser) => Promise<string>;
export { getUsers, updateUserDisconnect, getOtherUser };
