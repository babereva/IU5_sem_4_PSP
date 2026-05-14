const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = ({ title, category, inStock } = {}) => {
    let products = fileService.readData(dataFilePath);

    if (title) {
        products = products.filter(p =>
            p.title.toLowerCase().includes(title.toLowerCase())
        );
    }

    if (category) {
        products = products.filter(p =>
            p.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (inStock !== undefined) {
        const inStockBool = inStock === 'true' || inStock === true;
        products = products.filter(p => p.inStock === inStockBool);
    }

    return products;
};

const findOne = (id) => {
    const products = fileService.readData(dataFilePath);
    return products.find(p => p.id === id);
};

const create = (productData) => {
    const products = fileService.readData(dataFilePath);

    // берем максимальный ID + 1
    const newId = products.length > 0
        ? Math.max(...products.map(p => p.id)) + 1
        : 1;

    const newProduct = { id: newId, ...productData };
    products.push(newProduct);
    fileService.writeData(dataFilePath, products);

    return newProduct;
};

const update = (id, productData) => {
    const products = fileService.readData(dataFilePath);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return null;

    // объединяем старый объект с новыми данными
    products[index] = { ...products[index], ...productData };
    fileService.writeData(dataFilePath, products);

    return products[index];
};

const remove = (id) => {
    const products = fileService.readData(dataFilePath);
    // массив без удаляемого элемента
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) {
        return false; // Ничего не удалили
    }

    fileService.writeData(dataFilePath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
