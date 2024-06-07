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
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        // Respond with a 400-Bad Request status
        return res.status(400).json({message: "Error logging in. Please provide a username and a password."});
    }

    // Validate if username and password exist in the database
    if (authenticatedUser(username,password)) {

        // Generate JWT
        let accessToken = jwt.sign(
            { data: password}, 
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
