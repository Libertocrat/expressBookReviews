const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Check if username exist in our database
    let matchedUsers = users.filter((user) => user.username === username);

    // Valid is just 1 user was found with the provided username
    return(matchedUsers.length === 1);
}

const authenticatedUser = (username,password)=>{ //returns boolean

    // Filter user with the same username as password as those provided
    let validUsers = users.filter((user)=>{
        return (user.username === username && user.password === password);
    });

    // Username and password match, if there's 1 valid user
    return(validUsers.length === 1);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    // Retrieve username and password sent as body parameters
    const {username, password} = req.body;

    if (!username || !password) {
        // Respond with a 400-Bad Request status
        return res.status(400).json({message: "Error logging in. Please provide a username and a password."});
    }

    // Validate if username and password exist in the database
    if (authenticatedUser(username,password)) {

        // Generate signed JWT, attaching the username as the data field
        let accessToken = jwt.sign(
            { data: username}, 
            'access', 
            { expiresIn: 60 * 60 }
        );

        // Attach JWT to session
        req.session.authorization = {
            accessToken,username
        };

        return res.status(200).send(`Customer '${username}' is successfully logged in`);

    } else {
        // Respond with a 403 Forbidden status
        return res.status(403).json({message: "Invalid Login. Check username and password"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    
    // Retrieve the user who generated the request
    const username = req.user.data;
    // Get book ISBN from request
    const isbn = req.params.isbn;
    // Get review data from query parameters
    const review = req.query.review;

    // Validate ISBN
    if (!(isbn in books)) {
        // Respond with a 404 Not Found for an invalid ISBN
        return res.status(404).json({message: `ISBN '${isbn}' not found in database.`});
    }

    // Validate review content
    if (!review) {
        // Respond with a 400 Bad Request if the review is empty or not passed as a query parameter
        return res.status(400).json({message: "Review query parameter is missing or empty."});
    }

    // Validate username
    if (!isValid(username)) {
        // Respond with a 401 Unauthorized if the user is invalid (not found in database) or not passed in session
        return res.status(401).json({message: "User is invalid or not logged in."});
    }

    // Set review
    try {
        // Check if user has already posted a review under this ISBN
        let existingReview = username in books[isbn].reviews;

        // Set the book review by using the username as key, and the review content as value
        books[isbn].reviews[username] = review;

        if (existingReview) {
            // "200 OK" for an updated review
            return res.status(200).json(`The review from '${username}', for book with ISBN '${isbn}' has been updated.`);
        }
        else {
            // "201 Created" status for a new review
            return res.status(201).json(`The review from '${username}', for book with ISBN '${isbn}' has been added.`);
        }
        
    }
    catch (error) {
        return res.status(500).json(`An error has ocurred: '${error}'.`);
    }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
