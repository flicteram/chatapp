import 'express-async-errors';
import express from 'express';
import connectDB from './db/index.js';
import * as dotenv from 'dotenv';
import publicRoutes from './routes/publicRoutes.js';
import privateRoutes from './routes/privateRoutes.js';
import cookieParser from 'cookie-parser';
import handleErrors from './middleware/handle-errors.js';
import { Server } from 'socket.io';
import cors from 'cors';
import { createServer } from 'http';
import handleWebSocket from './socket.js';
dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: ["http://localhost:3000", "https://chatapp-frontend-ten.vercel.app"] } });
// middleware
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://chatapp-frontend-ten.vercel.app"]
}));
app.use(express.json());
app.use(cookieParser());
// routes
publicRoutes(app);
privateRoutes(app);
app.use(handleErrors);
// start
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('DB CONNECTED!');
        httpServer.listen(PORT, () => console.log(`Server is up and runnning on port ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
};
handleWebSocket(io);
start();
