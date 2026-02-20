const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");

const public_users = express.Router();

// Get the book list
public_users.get('/', (req, res) => {
    return res.json(books);
});

// Async version using axios (simulated)
public_users.get('/asyncbooks', async (req, res) => {
    try {
        // simulate async fetching
        let response = await Promise.resolve({ data: books });
        return res.json(response.data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) return res.json(books[isbn]);
    return res.status(404).json({ message: "Book not found" });
});

// Async ISBN route
public_users.get('/asyncisbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        if (books[isbn]) return res.json(books[isbn]);
        return res.status(404).json({ message: "Book not found" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const results = Object.values(books).filter(b => b.author.toLowerCase() === author);
    if (results.length) return res.json(results);
    return res.status(404).json({ message: "No books found by this author" });
});

// Async version for author
public_users.get('/asyncauthor/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();
        const results = Object.values(books).filter(b => b.author.toLowerCase() === author);
        if (results.length) return res.json(results);
        return res.status(404).json({ message: "No books found by this author" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const results = Object.values(books).filter(b => b.title.toLowerCase() === title);
    if (results.length) return res.json(results);
    return res.status(404).json({ message: "No books found with this title" });
});

// Async version for title
public_users.get('/asynctitle/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const results = Object.values(books).filter(b => b.title.toLowerCase() === title);
        if (results.length) return res.json(results);
        return res.status(404).json({ message: "No books found with this title" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) return res.json(books[isbn].reviews);
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;