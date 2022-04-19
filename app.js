const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors=require('cors');

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const userRouter = require('./routes/UserRoutes');
const BookRouter = require('./routes/BookRoutes');

const app = express()

// Global middlewares

// set security http headers
app.use(helmet());

// Limit many requestes from the same ip
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this ip, please try again later'
});
app.use('/', limiter);

// body parser for req.body
app.use(express.json());

app.use(cors());

// data sanitization against noSql query injection
app.use(mongoSanitize());

// data sanitization against xss
app.use(xss());

// prevent parameter pollution (2 sort for example)
app.use(hpp({
    whitelist: ['pages'] // fileds for allowed duplicate fields
}));

// Routes
app.use('/users', userRouter);
app.use('/books', BookRouter);

// Handle with wrong URL routes (all requests *=all paths)
app.all('*', (req, res, next) => {
    next(new AppError(`${req.originalUrl} does not exist on this server`), 404);
});

// Error midlewere handling
app.use(globalErrorHandler);

module.exports = app;