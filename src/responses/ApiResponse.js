export const ApiResponse = (status, code, message, data = null) => {
    return {
        status, 
        body: { 
            success: true,
            code: code,
            message: message,
            data: data
        }
    };
};