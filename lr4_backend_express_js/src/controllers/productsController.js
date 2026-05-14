const productsService = require('../services/productsService');

const getAllProducts = (req, res) => {
    const { title, category, inStock } = req.query;
    const products = productsService.findAll({ title, category, inStock });
    res.json(products);
};

const getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    const product = productsService.findOne(id);

    if (!product) {
        return res.status(404).json({ error: 'Продукт не найден' });
    }

    res.json(product);
};

const createProduct = (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Тело запроса не может быть пустым' });
    }

    const { src, title, text, description, category, age, inStock } = req.body;

    const newProduct = productsService.create({
        src,
        title,
        text,
        description,
        category,
        age,
        inStock
    });

    res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Тело запроса не может быть пустым' });
    }

    const updatedProduct = productsService.update(id, req.body);

    if (!updatedProduct) {
        return res.status(404).json({ error: 'Продукт не найден' });
    }

    res.json(updatedProduct);
};

const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const success = productsService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Продукт не найден' });
    }

    res.status(204).send();
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
