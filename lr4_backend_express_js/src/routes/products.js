const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Определение маршрутов
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.patch('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

router.options('/', (req, res) => {
    res.set('GET', 'POST', 'PUTCH', 'DELETE', 'OPTIONS')
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.set('GET', 'POST', 'PUTCH', 'DELETE', 'OPTIONS')
    res.status(204).send();
});

module.exports = router;
