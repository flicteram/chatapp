export default function handleCors(req, res, next) {
    const allowedOrigins = ['localhost:3000', 'https://chatapp-frontend-ten.vercel.app/'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', "true");
    }
    return next();
}
