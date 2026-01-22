import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  customer: {
    firstName: String,
    lastName: String,
    phone: String,
    wilaya: String,
    baladiya: String,
  },
  products: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
  }],
  total: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: String }, // Keeping as string to match existing type, or use Date
}, { timestamps: true });

export const ProductModel = models.Product || model('Product', ProductSchema);
export const OrderModel = models.Order || model('Order', OrderSchema);
