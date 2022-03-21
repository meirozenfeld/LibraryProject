const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A book must have a name'],
        unique: true
    },
    author: {
        type: String,
        required: [true, 'A book must have an author'],
    },
    stock: {
        type: Number,
        required: [true, 'A book must have a stock'],
    },
    currentStock: {
        type: Number,
        required: [true, 'A book must have a currentStock'],
    },
    borrowDurationDays: {
        type: Number,
        required: [true, 'A book must have a borrowDurationDays'],
    },
    pages: {
        type: Number,
        required: [true, 'A book must have a pages'],
    },
    genre: {
        type: String,
    }


});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

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

