const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Return all books in database
  return res.status(200).json({books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  const isbn = req.params.isbn;

  if (isbn in books) {
    
    let book = books[isbn];
    return res.status(200).json(book);
  }
  else {
    return res.status(404).json({message: `ISBN '${isbn}' not found in database`});
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
