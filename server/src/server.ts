import express, { Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
// Define the product interface
interface Product {
  id: number;
  name: string;
  weight?: string;
  orderDate?: Date;
  inStock?: boolean;
  customer?: string;
}

// Read data from the JSON file
function readData(): { products: Product[] } {
  const data = readFileSync('products.json', 'utf8');
  return JSON.parse(data);
}

// Write data to the JSON file
function writeData(data: { products: Product[] }) {
  writeFileSync('products.json', JSON.stringify(data, null, 2));
}

// Get a list of products
app.get('/products', (req: Request, res: Response) => {
  const data = readData();
  res.json(data.products);
});

// Create a new product
app.post('/products', (req: Request, res: Response) => {
  const data = readData();
  const newProduct: Product = {
    ...req.body,
    id: data.products.length + 1,
  };
  data.products.push(newProduct);
  writeData(data);
  res.json(newProduct);
});

// Delete a product by ID
app.delete('/products/:id', (req: Request, res: Response) => {
  const data = readData();
  const id = parseInt(req.params.id);
  data.products = data.products.filter((product) => product.id !== id);
  writeData(data);
  res.json({ message: 'Product deleted' });
});

// Update a product by ID
app.put('/products/:id', (req: Request, res: Response) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const updatedProductIndex = data.products.findIndex(
    (product) => product.id === id
  );

  if (updatedProductIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedProduct = {
    id,
    ...req.body,
  };

  data.products[updatedProductIndex] = updatedProduct;
  writeData(data);
  res.json(updatedProduct);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
