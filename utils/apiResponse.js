export const successResponse = (res, data, message = "Success") => {
    return res.status(200).json({
        success: true,
        message,
        data,
        code: 200,
    });
};

export const errorResponse = (res, message = "Error", code = 500) => {
    return res.status(code).json({
        success: false,
        message,
        data: null,
        code,
    });
};


export const sendResponse = (res, success, code, message, data, meta = {}) => {
    return res.status(code).json({
        success,
        code,
        meta,
        message,
        data,
    });
};
