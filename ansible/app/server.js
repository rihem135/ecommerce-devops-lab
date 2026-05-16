const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://mongodb:27017/ecommerce');

// Données produits (exemple)
const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Phone',  price: 800  }
];

// Route principale : affiche le catalogue
app.get('/', (req, res) => {
  const html = `
    <h1>E-Commerce Store</h1>
    <ul>
      ${products.map(p => `<li>${p.name} — $${p.price}</li>`).join('')}
    </ul>
  `;
  res.send(html);
});

// Route API JSON
app.get('/api/products', (req, res) => {
  res.json(products);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
