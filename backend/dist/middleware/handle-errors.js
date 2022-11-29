import CustomError from "../errors/customError.js";
const handleErrors = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
error, _req, res, _next) => {
    if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server Error' });
};
export default handleErrors;
