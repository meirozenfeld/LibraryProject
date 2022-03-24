const express = require('express');

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const userRouter = require('./routes/UserRoutes');
const BookRouter = require('./routes/BookRoutes');

const app = express();
app.use(express.json());

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