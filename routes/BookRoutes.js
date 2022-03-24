const express = require('express');
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/top-5-longest')
    .get(bookController.aliasLongestBooks, bookController.getAllBooks);

router
    .route('/')
    .get(authController.protect, bookController.getAllBooks)
    .post(bookController.createBook);

router
    .route('/:id')
    .get(bookController.getBook)
    .patch(bookController.updateBook)
    .delete(authController.protect, authController.premissionTo('admin', 'librarian'), bookController.deleteBook);

module.exports = router;