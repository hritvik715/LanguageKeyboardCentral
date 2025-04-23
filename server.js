import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static(path.join(__dirname, './')));
app.use(express.json());
// Serve static files from the "default_image" folder
app.use('./default_image', express.static(path.join(__dirname, 'default_image')));

// Sample data for the API
const products = [
    {
        id: 1,
        name: "Hindi Keyboard Pro",
        slug: "hindi-keyboard-pro",
        description: "Mechanical keyboard with Hindi language layout and RGB lighting. Perfect for daily typing and programming.",
        price: 649900,
        category: "keyboard",
        imageUrl: "./default_image/kanada_keyboard.png",
        rating: 4.8,
        reviewCount: 124,
        inStock: true,
        isFeatured: true,
        isNewArrival: false,
        languagesSupported: ["hi", "en"]
    },
    {
        id: 2,
        name: "Bengali Mech Keyboard",
        slug: "bengali-mech-keyboard",
        description: "Premium mechanical keyboard with Bengali character support. Features Cherry MX switches for the ultimate typing experience.",
        price: 719900,
        category: "keyboard",
        imageUrl: "./default_image/normal_keyboard.png",
        rating: 4.0,
        reviewCount: 78,
        inStock: true,
        isFeatured: true,
        isNewArrival: true,
        languagesSupported: ["bn", "en"]
    },
    {
        id: 3,
        name: "Tamil-English Combo",
        slug: "tamil-english-combo",
        description: "Keyboard and 24\" display combo with Tamil language support. Perfect for professionals who work in dual languages.",
        price: 1199900,
        category: "display_combo",
        imageUrl: "./default_image/pc.png",
        rating: 5.0,
        reviewCount: 42,
        inStock: true,
        isFeatured: true,
        isNewArrival: false,
        languagesSupported: ["ta", "en"]
    }
];

const languages = [
    { id: 1, code: "hi", name: "Hindi", nativeName: "हिन्दी", description: "Most popular language" },
    { id: 2, code: "bn", name: "Bengali", nativeName: "বাংলা", description: "Full character support" },
    { id: 3, code: "ta", name: "Tamil", nativeName: "தமிழ்", description: "Classical language" },
    { id: 4, code: "te", name: "Telugu", nativeName: "తెలుగు", description: "Complete layout" },
    { id: 5, code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", description: "Special edition available" }
];

// Store cart items in memory
let cartItems = [];
let cartId = 1;

// API routes
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/featured', (req, res) => {
    const featuredProducts = products.filter(product => product.isFeatured);
    res.json(featuredProducts);
});

app.get('/api/products/:slug', (req, res) => {
    const product = products.find(p => p.slug === req.params.slug);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});


//imp-> endpoints daal diya to fetch data from id(just mentioning the id)
app.get('/api/products/id/:id', (req, res) => {
    const id = parseInt(req.params.id); // Convert id to a number
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});




//imp-> Modify the Existing Endpoint to Support Both id and slug =>If you want a single endpoint to handle both id and slug, you can modify the existing route:
// app.get('/api/products/:identifier', (req, res) => {
//     const identifier = req.params.identifier;

//     // Check if the identifier is a number (id) or a string (slug)
//     const product = isNaN(identifier)
//         ? products.find(p => p.slug === identifier) // Search by slug
//         : products.find(p => p.id === parseInt(identifier)); // Search by id

//     if (product) {
//         res.json(product);
//     } else {
//         res.status(404).json({ message: 'Product not found' });
//     }
// });











app.get('/api/languages', (req, res) => {
    res.json(languages);
});

app.get('/api/languages/:code', (req, res) => {
    const language = languages.find(l => l.code === req.params.code);
    if (language) {
        res.json(language);
    } else {
        res.status(404).json({ message: 'Language not found' });
    }
});

app.get('/api/cart', (req, res) => {
    const sessionId = req.query.sessionId;
    const items = cartItems.filter(item => item.sessionId === sessionId);
    res.json(items);
});

app.post('/api/cart/add', (req, res) => {
    const { sessionId, productId, quantity } = req.body;

    // Check if product exists
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item already in cart
    const existingItem = cartItems.find(
        item => item.sessionId === sessionId && item.productId === productId
    );

    if (existingItem) {
        existingItem.quantity += quantity || 1;
        res.json(existingItem);
    } else {
        const newItem = {
            id: cartId++,
            sessionId,
            productId,
            quantity: quantity || 1
        };
        cartItems.push(newItem);
        res.json(newItem);
    }
});

app.put('/api/cart/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;

    const item = cartItems.find(item => item.id === id);
    if (!item) {
        return res.status(404).json({ message: 'Cart item not found' });
    }

    item.quantity = quantity;
    res.json(item);
});

app.delete('/api/cart/remove/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = cartItems.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItems.splice(index, 1);
    res.json({ success: true });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});