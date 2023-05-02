import refreshRouter from '../api/refresh.js';
import logoutRouter from '../api/logout.js';
import registerRouter from '../api/register.js';
import authRouter from '../api/auth.js';
export default function publicRoutes(app) {
    app.use('/api/register', registerRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/logout', logoutRouter);
    app.use('/api/refresh', refreshRouter);
}
