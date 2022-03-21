const express = require('express');

const userRouter = require('./routes/UserRoutes');
const BookRouter = require('./routes/BookRoutes');

const app = express();
app.use(express.json())

// Routes
app.use('/users', userRouter);
app.use('/books', BookRouter);
module.exports = app;