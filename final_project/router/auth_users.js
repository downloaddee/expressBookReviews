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
        console.log(`login: ${JSON.stringify(req.session)}, ${req.session.authorization.username}`)
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Che ck username and password." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    console.log(`put review: ${JSON.stringify(req.session)}`)
    const isbn = req.params.isbn
    let filtered_books = books.filter((book) => book.isbn === isbn)

    if (filtered_books.length > 0) {
        const username = req.session.authorization['username'];
        let filtered_book = filtered_books[0];
        let reviews = filtered_book.reviews;
        let updated_review_of_user = {
            "username": username,
            "review": req.body.review
        }

        let updated_reviews = reviews.filter((review) => review.username != username)
        updated_reviews.push(updated_review_of_user)
        filtered_book.reviews = updated_reviews
        books = books.filter((book) => book.isbn != isbn)
        books.push(filtered_book)

        res.send(`Updated review of book with isbn ${isbn}.`)
        
    } else {
        res.send("No book found!");
    }

  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
