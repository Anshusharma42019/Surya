const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Server Error", code: 500 });
};

export default errorHandler;
