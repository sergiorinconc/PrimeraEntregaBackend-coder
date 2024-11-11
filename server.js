const express = require('express');
const app = express();

const productsRouter = require('./routers/products');
const cartsRouter = require('./routers/carts');

app.use(express.json());

// mensaje de bienvenida
app.get('/', (req, res) => {
    res.send('¡Bienvenido al API de E-commerce! Usa /api/products o /api/carts para interactuar.');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

