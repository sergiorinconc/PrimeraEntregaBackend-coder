const express = require('express');
const fs = require('fs').promises;
const router = express.Router();
const cartFilePath = './data/carrito.json';

//  para leer archivo JSON de carritos
const readCartFile = async () => {
    const data = await fs.readFile(cartFilePath, 'utf-8');
    return JSON.parse(data);
};

//  para escribir archivo JSON de carritos
const writeCartFile = async (data) => {
    await fs.writeFile(cartFilePath, JSON.stringify(data, null, 2));
};


// GET /  Lista todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await readCartFile();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los carritos' });
    }
});

// POST / 
router.post('/', async (req, res) => {
    try {
        const carts = await readCartFile();
        const newCart = {
            id: (carts.length + 1).toString(),
            products: []
        };
        carts.push(newCart);
        await writeCartFile(carts);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// GET /:cid - Lista por id en el carrito
router.get('/:cid', async (req, res) => {
    try {
        const carts = await readCartFile();
        const cart = carts.find(c => c.id === req.params.cid);
        cart ? res.json(cart.products) : res.status(404).json({ error: "Carrito no encontrado" });
    } catch (error) {
        res.status(500).json({ error: 'Error al leer el carrito' });
    }
});

// POST /:cid/product/:pid - Agrega producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carts = await readCartFile();
        const cart = carts.find(c => c.id === req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        const productId = req.params.pid;
        const productInCart = cart.products.find(p => p.product === productId);

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await writeCartFile(carts);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

// DELETE / - Elimina un carrito

router.delete('/:cid', async (req, res) => {
    try {
        const carts = await readCartFile();
        const newCarts = carts.filter(c => c.id !== req.params.cid);
        await writeCartFile(newCarts);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});


module.exports = router;
