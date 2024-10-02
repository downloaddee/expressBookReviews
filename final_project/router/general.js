const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
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
public_users.get('/',function (req, res) {

  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn
  let book = books[isbn]
  if (book) {  
    res.send(JSON.stringify({book}, null, 4)); 
  } else {
    res.status(404).json({ message: `Book with isbn ${isbn} not found` });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    const isbns = Object.keys(books)
    let books_with_author = []
    for (const isbn of isbns) {
        let book_with_isbn = books[isbn];
        if (book_with_isbn.author === author){
            books_with_author.push(book_with_isbn);
        }
    }

    res.send(books_with_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    const isbns = Object.keys(books)
    let books_with_title = []
    for (const isbn of isbns) {
        let book_with_isbn = books[isbn];
        if (book_with_isbn.title === title){
            books_with_title.push(book_with_isbn);
        }
    }

    res.send(books_with_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let book = books[isbn]
  if (book) {  
    res.send(book.reviews); 
  } else {
    res.status(404).json({ message: `Book with isbn ${isbn} not found` });
  }
  
});

module.exports.general = public_users;
