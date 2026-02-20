const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
let books = require('./booksdb.js');

let users = [];

// Check if username exists
const isValid = (username) => {
    return users.some(u => u.username === username);
}

// Authenticate user
const authenticatedUser = (username, password) => {
    return users.some(u => u.username === username && u.password === password);
}

// Register user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });
    if (isValid(username)) return res.status(400).json({ message: "Username already exists" });
    users.push({ username, password });
    return res.json({ message: "User registered successfully" });
});

// Login user
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!authenticatedUser(username, password)) return res.status(401).json({ message: "Invalid username or password" });
    req.session.username = username;
    return res.json({ message: "User logged in", token: jwt.sign({ username }, "access", { expiresIn: 60 * 60 }) });
});

// Add or modify review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.username;

    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    books[isbn].reviews[username] = review;
    return res.json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    delete books[isbn].reviews[username];
    return res.json({ message: "Review deleted", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;