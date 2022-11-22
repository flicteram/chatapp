import { Request, Response } from 'express';
declare const newConversation: (req: Request, res: Response) => Promise<void>;
declare const newMessage: (req: Request, res: Response) => Promise<void>;
declare const getConversation: (req: Request, res: Response) => Promise<void>;
declare const getConversationNew: (req: Request, res: Response) => Promise<void>;
declare const seenMessages: (req: Request, res: Response) => Promise<void>;
export { newConversation, newMessage, getConversation, getConversationNew, seenMessages };
