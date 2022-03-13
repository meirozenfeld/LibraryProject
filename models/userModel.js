const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

//// Test Example
// const testUser = new User({
//     name: 'Moshe',
//     email: 'Mo@gmail.com',
//     password: '654321'
// });
// testUser.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('Error! :', err);
// });

