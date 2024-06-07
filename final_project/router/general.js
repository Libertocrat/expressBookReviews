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

    // Extract just the books with the requested author
    let filteredBooks = Object.values(books).filter((book) => book.author === author);

    return res.status(200).json({booksbyauthor: filteredBooks});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
