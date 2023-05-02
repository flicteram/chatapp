import verifyJWT from '../middleware/verifyJWT.js';
import conversation from '../api/conversation.js';
import conversations from '../api/conversations.js';
import usersRouter from '../api/users.js';
export default function privateRoutes(app) {
    app.use(verifyJWT);
    app.use('/api/users', usersRouter);
    app.use('/api/conversation', conversation);
    app.use('/api/conversations', conversations);
}
