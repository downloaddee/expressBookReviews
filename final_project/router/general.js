const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({ books }, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const get_books_by_isbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn
        let book = books[isbn]
        if (book) {
            resolve(res.send(JSON.stringify({ book }, null, 4)));
        } else {
            resolve(res.status(404).json({ message: `Book with isbn ${isbn} not found` }));
        }
    });

    get_books_by_isbn.then(() => console.log("Promise for Task 11 resolved"));

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const get_books_by_author = new Promise((resolve, reject) => {
        const author = req.params.author
        const isbns = Object.keys(books)
        let books_with_author = []
        for (const isbn of isbns) {
            let book_with_isbn = books[isbn];
            if (book_with_isbn.author === author) {
                books_with_author.push(book_with_isbn);
            }
        }

        resolve(res.send(JSON.stringify({ books_with_author }, null, 4)));
    });
    get_books_by_author.then(() => console.log("Promise for Task 12 resolved"));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const get_books_by_title = new Promise((resolve, reject) => {
        const title = req.params.title
        const isbns = Object.keys(books)
        let books_with_title = []
        for (const isbn of isbns) {
            let book_with_isbn = books[isbn];
            if (book_with_isbn.title === title) {
                books_with_title.push(book_with_isbn);
            }
        }

        resolve(res.send(JSON.stringify({ books_with_title }, null, 4)));
    });
    get_books_by_title.then(() => console.log("Promise for Task 13 resolved"));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn
    let book = books[isbn]
    if (book) {
        res.send(book.reviews);
    } else {
        res.status(404).json({ message: `Book with isbn ${isbn} not found` });
    }

});

module.exports.general = public_users;
