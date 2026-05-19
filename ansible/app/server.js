const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://mongodb:27017/ecommerce');

// Définition du modèle Product
const Product = mongoose.model('Product', {
  name: String,
  price: Number
});

// Fonction d'initialisation des produits (uniquement si la base est vide)
const initProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Laptop', price: 1200 },
      { name: 'Phone', price: 800 },
      { name: 'Tablet', price: 500 }
    ]);
    console.log('✅ Produits initialisés dans MongoDB');
  }
};

// Route principale : affiche le catalogue depuis MongoDB
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    const html = `
      <h1>E-Commerce Store</h1>
      <ul>
        ${products.map(p => `<li>${p.name} — $${p.price}</li>`).join('')}
      </ul>
      <p><small>📦 Données stockées dans MongoDB</small></p>
    `;
    res.send(html);
  } catch (error) {
    res.send('<h1>Erreur</h1><p>Impossible de charger les produits</p>');
  }
});

// Route API JSON (données depuis MongoDB)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Initialisation au démarrage
initProducts();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));