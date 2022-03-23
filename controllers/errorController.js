const AppError = require('./../utils/appError');

// const handleCastErrorDB = err => {
//     const message = `Invalid ${err.path}: ${err.value}`;
//     return new AppError(message, 400);
// };


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err };

    // if (error.name === 'CastError') error = handleCastErrorDB(error);

    // Create duplicate value
    if (err.code === 11000) {
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
        const message = `Duplicate field value: ${value}. Please use another value!`;
        error = new AppError(message, 400);
    }

    // fields validate errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        error = new AppError(message, 400);
    }

    // Operational, trusted errors
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            // error: err
        });
    }

    // Unknown, proggraming errors
    else {
        console.log("The Error:  ", err)
        res.status(500).json({
            status: 'error',
            message: 'Something Wrong!',
            // error: err
        });
    }

}