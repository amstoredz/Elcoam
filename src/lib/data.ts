import fs from 'fs';
import path from 'path';
import { Product, Order } from './types';
import connectDB from './mongodb';
import { ProductModel, OrderModel } from './models';

// Re-export types
export type { Product, Order } from './types';

const dataDir = path.join(process.cwd(), 'src', 'data');
const productsFile = path.join(dataDir, 'products.json');
const ordersFile = path.join(dataDir, 'orders.json');

// Ensure data directory exists for local fallback
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    // Ignore error if directory creation fails (e.g. in readonly environment)
    console.warn('Could not create data directory, file system storage might fail:', e);
  }
}

// Helper to check if we should use MongoDB
async function shouldUseMongo() {
  const conn = await connectDB();
  return !!conn;
}

// --- Products ---

export async function getProducts(): Promise<Product[]> {
  if (await shouldUseMongo()) {
    const products = await ProductModel.find({}).lean();
    return products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      description: p.description,
      image: p.image,
      category: p.category
    }));
  }

  // Fallback to File System
  if (!fs.existsSync(productsFile)) return [];
  const fileContent = fs.readFileSync(productsFile, 'utf-8');
  try {
    return JSON.parse(fileContent);
  } catch (e) {
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (await shouldUseMongo()) {
    const product = await ProductModel.findOne({ id }).lean();
    if (!product) return undefined;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      description: product.description,
      image: product.image,
      category: product.category
    } as Product;
  }

  // Fallback
  const products = await getProducts(); // This calls FS version effectively if no mongo
  return products.find(p => p.id === id);
}

export async function saveProduct(product: Product) {
  if (await shouldUseMongo()) {
    await ProductModel.findOneAndUpdate(
      { id: product.id },
      product,
      { upsert: true, new: true }
    );
    return;
  }

  // Fallback
  // Note: We use the async getProducts but for saving in FS we need to read sync or re-implement logic
  // To keep it simple, we read file directly here for FS operations to ensure consistency
  let products: Product[] = [];
  if (fs.existsSync(productsFile)) {
    try {
      products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    } catch (e) {}
  }

  const existingIndex = products.findIndex((p) => p.id === product.id);
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

export async function deleteProduct(id: string) {
  if (await shouldUseMongo()) {
    await ProductModel.deleteOne({ id });
    return;
  }

  // Fallback
  let products: Product[] = [];
  if (fs.existsSync(productsFile)) {
    try {
      products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    } catch (e) {}
  }
  products = products.filter(p => p.id !== id);
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// --- Orders ---

export async function getOrders(): Promise<Order[]> {
  if (await shouldUseMongo()) {
    const orders = await OrderModel.find({}).sort({ createdAt: -1 }).lean();
    return orders.map((o: any) => ({
      id: o.id,
      customer: o.customer,
      products: o.products,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt
    }));
  }

  // Fallback
  if (!fs.existsSync(ordersFile)) return [];
  const fileContent = fs.readFileSync(ordersFile, 'utf-8');
  try {
    return JSON.parse(fileContent);
  } catch (e) {
    return [];
  }
}

export async function saveOrder(order: Order) {
  if (await shouldUseMongo()) {
    await OrderModel.create(order);
    return;
  }

  // Fallback
  let orders: Order[] = [];
  if (fs.existsSync(ordersFile)) {
    try {
      orders = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
    } catch (e) {}
  }
  orders.push(order);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}
