"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3002;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Read data from the JSON file
function readData() {
    const data = (0, fs_1.readFileSync)('products.json', 'utf8');
    return JSON.parse(data);
}
// Write data to the JSON file
function writeData(data) {
    (0, fs_1.writeFileSync)('products.json', JSON.stringify(data, null, 2));
}
// Get a list of products
app.get('/products', (req, res) => {
    const data = readData();
    res.json(data.products);
});
// Create a new product
app.post('/products', (req, res) => {
    const data = readData();
    const newProduct = Object.assign(Object.assign({}, req.body), { id: data.products.length + 1 });
    data.products.push(newProduct);
    writeData(data);
    res.json(newProduct);
});
// Delete a product by ID
app.delete('/products/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    data.products = data.products.filter((product) => product.id !== id);
    writeData(data);
    res.json({ message: 'Product deleted' });
});
// Update a product by ID
app.put('/products/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const updatedProductIndex = data.products.findIndex((product) => product.id === id);
    if (updatedProductIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const updatedProduct = Object.assign({ id }, req.body);
    data.products[updatedProductIndex] = updatedProduct;
    writeData(data);
    res.json(updatedProduct);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
