export default class Error {
    static handle (message, statusCode, response, data = null) {
        return response.status(statusCode).json({
            message,
            status : "error",
            data
        });
    }
    
}