const mongoose = require('mongoose');
const dotenv = require('dotenv');

// bugs and Uncaught Exception on the code 
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log("Uncaught Exception! Shutting down...");
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// DB connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB Connection successful!'));


// Start Server
const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`App running on port ${port} ...`)
});

// DB connection failed
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log("Unhandled Rejection! Shutting down...");
    server.close(() => {
        process.exit(1);
    })
});