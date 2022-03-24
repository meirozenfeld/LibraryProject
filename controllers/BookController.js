const Book = require('../models/bookModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasLongestBooks = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-pages';
    req.query.fields = 'name,author,pages,genre';
    next();
};

exports.getAllBooks = catchAsync(async (req, res, next) => {
    // const books = await Book.find();

    const features = new APIFeatures(Book.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const books = await features.query;
    
    res.status(200).json({
        status: 'success',
        numberOfResults: books.length,
        data: {
            books
        }
    });
});

exports.getBook = catchAsync(async (req, res, next) => {
    // id validation for mongoose
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return next(new AppError(`${req.params.id} id Invalid `, 400));
    }

    const book = await Book.findById(req.params.id);
    // User.findOne({_id: req.params.id}); // same result deferent way

    if (!book) {
        return next(new AppError('No book found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            book
        }
    });
});

exports.createBook = catchAsync(async (req, res, next) => {
    const newBook = await Book.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            user: newBook
        }
    });
});

exports.updateBook = catchAsync(async (req, res, next) => {
    // id validation for mongoose
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return next(new AppError('No book found', 404));
    }
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!book) {
        return next(new AppError('No book found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            book
        }
    });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return next(new AppError('No book found', 404));
    }
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
        return next(new AppError('No book found', 404));
    }

    res.status(204).json({
        status: 'success, book deleted',
        data: null
    });
});
