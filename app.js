const express = require('express');

const userRouter = require('./routes/UserRoutes');

const app = express();
app.use(express.json())

// Routes
app.use('/users', userRouter);
module.exports = app;