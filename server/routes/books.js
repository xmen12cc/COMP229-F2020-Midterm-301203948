// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
const Book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  Book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
      res.redirect('/books/add');
});

// POST process the Book Details page and create a new Book
router.post('/add', async (req, res, next) => {
  try {
    const { title, description, price, author, genre } = req.body;
    const newBook = new Book({ 
      Title: title,
      Description: description,
      Price: price,
      Author: author,
      Genre: genre });
    const savedBook = await newBook.save();
    res.redirect('/books');
  } catch (error) {
    console.error('Error saving book', error);
    res.status(500).send('Error saving book');
  }
});

// GET the Book Details page in order to edit an existing Book
router.get('/edit/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    res.render('books/details', {title: 'Edit Book', books: book });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', async (req, res, next) => {
  try {
    const { title, description, price, author, genre } = req.body;
    await Book.findByIdAndUpdate(req.params.id, { 
      Title: title,
      Description: description, 
      Price: price, 
      Author: author, 
      Genre: genre });
    res.redirect('/books');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// GET - process the delete by user id
router.get('/delete/:id', async (req, res, next) => {
  try {
    await Book.findByIdAndRemove(req.params.id);
    res.redirect('/books');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
