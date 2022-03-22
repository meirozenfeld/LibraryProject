const Book = require('./../models/bookModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasLongestBooks = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-pages';
    req.query.fields = 'name,author,pages,genre';
    next();
};

exports.getAllBooks = async (req, res) => {
    try {
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

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            massage: err
        });
    }

};

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        // User.findOne({_id: req.params.id}); // same result defrent way

        res.status(201).json({
            status: 'success',
            data: {
                book
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            massage: err
        });
    };

}
exports.createBook = async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                user: newBook
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            massage: err
        });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            massage: err
        });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success, book deleted',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            massage: err
        });
    }
};
