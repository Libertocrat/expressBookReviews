const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/*** PROMISES ***/

// Retrieve all books from the database, as an asyncronous function
const getAllBooks = new Promise((resolve, reject) => {

    // Return all books if database is valid
    try {
        const allBooks = books;
        resolve(allBooks);
    }
    catch (error) {
        reject(error);
    }
    
});

// Retrieve a book by ISBN from the database, as an asyncronous function
const getByISBN = (isbn) => new Promise( async (resolve, reject) => {

    // Call & await the Promise to get all books, to avoid blocking
    const allBooks = await getAllBooks;

    // Check if ISBN is in the database
    if (isbn in allBooks) {

        // ISBN was found, resolve Promise with book object
        let book = books[isbn];
        resolve(book);
    }
    else {
        // ISBN wasn't found, reject Promise with error message
        reject(`ISBN '${isbn}' not found in database.`);
    }
    
});

/*** ROUTES ***/

public_users.post("/register", (req,res) => {

    // Retrieve user & pwd from body parameters
    const username = req.body.username;
    const password = req.body.password;

    // Validate that username and password are provided
    if (!username || !password) {
        // Respond with a 400-Bad Request status
        return res.status(400).json({message: "Please provide a username and a password as body parameters."});
    }

    // Check if username already exists
    let repeatedUsers = users.filter((user) => user.username === username);
    if (repeatedUsers.length > 0) {
        // Respond with a 409 Conflict status
        return res.status(409).json({message: `User '${username}' already exists. Please choose another one.`});
    }

    // Register user
    let newUser = {
        username: username,
        password: password
    };
    users.push(newUser);

    // Return a 201 Created status
    return res.status(201).json({message: "Customer successfully registered. Now you can login"});
    
});

// Get the book list available in the shop, asyncronously
public_users.get('/', async function (req, res) {

    try {
        // Call & await the Promise to get all books, to avoid blocking
        let allBooks = await getAllBooks;

        // Return all books in database once the Promise has resolved
        return res.status(200).json({books: allBooks});
    }
    catch(error) {
        // "500 Internal Server Error" if the Promise throws an error
        return res.status(500).json(`An error has ocurred: '${error}'.`);
    }
  
});

// Get book details based on ISBN, asyncronously
public_users.get('/isbn/:isbn', async function (req, res) {
  
    // Fetch ISBN from the request path
    const isbn = req.params.isbn;

    try {
        // Call & await the Promise to get all books, to avoid blocking
        const book = await getByISBN(isbn);

        // Return book with matching ISBN, once the Promise has resolved
        return res.status(200).json(book);
    }
    catch(error) {
        // Respond with a "404 Not Found" if the Promise was rejected
        return res.status(404).json({message: error});
    }
  
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
    // Parse requested author
    const author = req.params.author;

    // Array of books having the requested author
    let booksByAuthor = [];

    for (const [isbn, book] of Object.entries(books)) {

        // Add just the books with the requested author
        if(book.author === author) {
            booksByAuthor.push({
                isbn: isbn,
                title: book.title,
                reviews: book.reviews
            });
        }
    }

    return res.status(200).json({booksbyauthor: booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    // Parse requested title
    const title = req.params.title;

    // Array of books having the requested title
    let booksByTitle = [];

    for (const [isbn, book] of Object.entries(books)) {

        // Add just the books with the requested title
        if(book.title === title) {
            booksByTitle.push({
                isbn: isbn,
                author: book.author,
                reviews: book.reviews
            });
        }
    }

    return res.status(200).json({booksbytitle: booksByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;

    if (isbn in books) {
    
        // Get book by isbn, which corresponds with the key
        let book = books[isbn];
        return res.status(200).json(book.reviews);
    }
    else {
        return res.status(404).json({message: `ISBN '${isbn}' not found in database`});
    }
});

module.exports.general = public_users;
