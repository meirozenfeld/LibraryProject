const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A book must have a name'],
        unique: true,
        minLength: [1, "A book name must have more or equal then 1 characters"]
    },
    author: {
        type: String,
        required: [true, 'A book must have an author'],
        minLength: [1, "A book author must have more or equal then 1 characters"]
    },
    stock: {
        type: Number,
        required: [true, 'A book must have a stock'],
        min: [1, "A book stock must have more then 0"]

    },
    currentStock: {
        type: Number,
        min: [0, "A book stock must have more or equal then 0"],
        validate: {
            validator: function (val) {
                return val <= this.stock;
            },
            message: 'A book stock {VALUE} must have less or equal then stock value'
        }
    },
    borrowDurationDays: {
        type: Number,
        required: [true, 'A book must have a borrowDurationDays']
    },
    pages: {
        type: Number,
        required: [true, 'A book must have a pages']
    },
    genre: {
        type: String
    }


});

bookSchema.post('save', function (doc, next) {
    if (this.currentStock == null) {
        this.currentStock = this.stock;
    }
    next();
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

