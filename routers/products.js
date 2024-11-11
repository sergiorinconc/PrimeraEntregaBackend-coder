const express = require('express');
const fs = require('fs').promises;
const router = express.Router();
const filePath = './data/productos.json';

//  leer archivo JSON
const readProductsFile = async () => {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
};

// para escribir archivo JSON
const writeProductsFile = async (data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// GET / 
router.get('/', async (req, res) => {
    try {
        const products = await readProductsFile();
        const limit = parseInt(req.query.limit);
        res.json(limit ? products.slice(0, limit) : products);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los productos' });
    }
});

// GET  por ID
router.get('/:pid', async (req, res) => {
    try {
        const products = await readProductsFile();
        const product = products.find(p => p.id === req.params.pid);
        product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los productos' });
    }
});

// POST / 
router.post('/', async (req, res) => {
    try {
        const products = await readProductsFile();
        const newProduct = {
            id: (products.length + 1).toString(),
            ...req.body,
            status: req.body.status !== undefined ? req.body.status : true
        };
        products.push(newProduct);
        await writeProductsFile(products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// PUT / por id
router.put('/:pid', async (req, res) => {
    try {
        const products = await readProductsFile();
        const index = products.findIndex(p => p.id === req.params.pid);
        if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

        const updatedProduct = { ...products[index], ...req.body };
        products[index] = updatedProduct;
        await writeProductsFile(products);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// DELETE / - Elimina un producto
router.delete('/:pid', async (req, res) => {
    try {
        const products = await readProductsFile();
        const newProducts = products.filter(p => p.id !== req.params.pid);
        await writeProductsFile(newProducts);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
