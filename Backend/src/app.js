const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes')); 

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Product API is working' });
});

module.exports = app;
