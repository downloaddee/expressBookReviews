const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userwithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userwithsamename.length === 0;
};

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
            return res.status(404).json({ message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });
        
        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Che ck username and password." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        const username = req.session.authorization['username'];

        book.reviews[username] = req.body.review;
        books[isbn] = book;

        res.send(`Updated review of book with isbn ${isbn}.`)
        
    } else {
        res.send("No book found!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        const username = req.session.authorization['username'];

        let existing_review = book.reviews[username];

        if (existing_review) {
            delete book.reviews[username]
        }

        books[isbn] = book;

        res.send(`Deleted review of book with isbn ${isbn}.`)
        
    } else {
        res.send("No book found!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
