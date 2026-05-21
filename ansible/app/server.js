const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

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
      { name: 'Tablet', price: 500 },
      { name: 'Headphones', price: 150 },
      { name: 'Smartwatch', price: 250 }
    ]);
    console.log('✅ Produits initialisés dans MongoDB');
  }
};

// Route principale : affiche le catalogue avec design moderne
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-Commerce Store</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
            padding: 40px 20px;
          }
          
          .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          
          .header p {
            font-size: 1.2rem;
            opacity: 0.9;
          }
          
          .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
          }
          
          .product-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          
          .product-icon {
            font-size: 3rem;
            margin-bottom: 15px;
          }
          
          .product-name {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
          }
          
          .product-price {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 15px;
          }
          
          .product-price::before {
            content: '$';
            font-size: 1.2rem;
          }
          
          .buy-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            transition: opacity 0.3s ease;
          }
          
          .buy-btn:hover {
            opacity: 0.9;
          }
          
          .footer {
            text-align: center;
            color: white;
            padding: 20px;
            margin-top: 40px;
            border-top: 1px solid rgba(255,255,255,0.2);
          }
          
          .badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-top: 10px;
          }
          
          .api-link {
            color: white;
            text-decoration: none;
            border-bottom: 1px dashed white;
          }
          
          .api-link:hover {
            border-bottom: 1px solid white;
          }
          
          @media (max-width: 768px) {
            .header h1 {
              font-size: 2rem;
            }
            .products-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛍️ E-Commerce Store</h1>
            <p>Découvrez nos meilleurs produits</p>
          </div>
          
          <div class="products-grid">
            ${products.map(p => `
              <div class="product-card">
                <div class="product-icon">${getProductIcon(p.name)}</div>
                <div class="product-name">${escapeHtml(p.name)}</div>
                <div class="product-price">${p.price}</div>
                <button class="buy-btn" onclick="alert('${escapeHtml(p.name)} ajouté au panier !')">
                  🛒 Ajouter au panier
                </button>
              </div>
            `).join('')}
          </div>
          
          <div class="footer">
            <p>📦 Données stockées dans MongoDB</p>
            <div class="badge">
              🔗 API JSON : <a href="/api/products" class="api-link">/api/products</a>
            </div>
          </div>
        </div>
        
        <script>
          function getProductIcon(name) {
            const icons = {
              'Laptop': '💻',
              'Phone': '📱',
              'Tablet': '📟',
              'Headphones': '🎧',
              'Smartwatch': '⌚'
            };
            return icons[name] || '📦';
          }
        </script>
      </body>
      </html>
    `;
    
    // Fonction helper pour échapper le HTML
    function escapeHtml(str) {
      return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    }
    
    // Fonction helper pour l'icône (à l'intérieur du scope)
    const getProductIcon = (name) => {
      const icons = {
        'Laptop': '💻',
        'Phone': '📱',
        'Tablet': '📟',
        'Headphones': '🎧',
        'Smartwatch': '⌚'
      };
      return icons[name] || '📦';
    };
    
    // Reconstruire le HTML avec les fonctions
    const finalHtml = html.replace('getProductIcon(p.name)', 'getProductIcon(p.name)');
    
    res.send(html.replace(/\\$\\{products.map.*?\\}/, products.map(p => `
              <div class="product-card">
                <div class="product-icon">${getProductIcon(p.name)}</div>
                <div class="product-name">${escapeHtml(p.name)}</div>
                <div class="product-price">${p.price}</div>
                <button class="buy-btn" onclick="alert('${escapeHtml(p.name)} ajouté au panier !')">
                  🛒 Ajouter au panier
                </button>
              </div>
            `).join('')));
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

// Route POST pour ajouter un produit (via API)
app.post('/api/products', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'name et price sont requis' });
    }
    const newProduct = new Product({ name, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Initialisation au démarrage
initProducts();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));