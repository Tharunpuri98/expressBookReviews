const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//  Task 6
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (users.find((user) => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
      }
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// // Get the book list available in the shop Task 1
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.setHeader("Content-Type", "application/json");
//   res.send(JSON.stringify(books, null, 2));
// });

// Get the book list available in the shop (using async/await) Task 10
public_users.get('/', async function (req, res) {
    try {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(books, null, 2)); // Return all books
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book list" });
    }
});


// // Get book details based on ISBN Task 2
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//     const isbn = req.params.isbn;  // Extract ISBN from request URL
//     const book = books[isbn]; // Find book by ISBN

//     if (book) {
//         res.json(book);  // Return book details
//     } else {
//         res.status(404).json({ message: "Book not found" });
//     }
//  });

 // Get book details based on ISBN Task 11
 public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (book) {
            res.json(book); // Return book details
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book" });
    }
});
  
// // Get book details based on author Task 3
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const authorName = req.params.author
//   const matchingBooks=[];
//   Object.keys(books).forEach(isbn => {
//     if (books[isbn].author.toLowerCase() === authorName.toLowerCase()) {
//         matchingBooks.push({ isbn, ...books[isbn] });
//     }
//     });

//     if (matchingBooks.length > 0) {
//         res.json(matchingBooks);  // Return matching books
//     } else {
//         res.status(404).json({ message: "No books found by this author" });
//     }
// });

// Get book details based on author Task 12
public_users.get('/author/:author', async function (req, res) {
    try {
        const authorName = req.params.author.toLowerCase();
        const matchingBooks = Object.keys(books)
            .map(isbn => ({ isbn, ...books[isbn] }))
            .filter(book => book.author.toLowerCase() === authorName);

        if (matchingBooks.length > 0) {
            res.json(matchingBooks); // Return books by author
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// // Get all books based on title Task 4
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const titleName = decodeURIComponent(req.params.title).trim().toLowerCase();
//   const matchingBooks=[];
//   Object.keys(books).forEach(isbn => {
//     if (books[isbn].title.toLowerCase() === titleName) {
//         matchingBooks.push({ isbn, ...books[isbn] });
//     }
//     });

//     if (matchingBooks.length > 0) {
//         res.json(matchingBooks);  // Return matching books
//     } else {
//         res.status(404).json({ message: "No books found with this title" });
//     }
// });

// Get all books based on title Task 13
public_users.get('/title/:title', async function (req, res) {
    try {
        const titleName = decodeURIComponent(req.params.title).trim().toLowerCase();
        const matchingBooks = Object.keys(books)
            .map(isbn => ({ isbn, ...books[isbn] }))
            .filter(book => book.title.toLowerCase() === titleName);

        if (matchingBooks.length > 0) {
            res.json(matchingBooks); // Return books by title
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});


//  Get book review Task 5
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn].reviews){
    res.send(books[isbn].reviews)
  } else{
    res.status(404).json({ message: "Book not found" });
  }
   
});

module.exports.general = public_users;
