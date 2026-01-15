import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/productModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const products = [
  {
    name: 'Floral Kurti',
    price: 799,
    stock: 25,
    category: 'Kurtis',
    description: 'Comfortable floral kurti in cotton blend.',
    images: ['/uploads/demo1.jpg'],
    deliveryCharge: 49,
  },
  {
    name: 'Denim Jacket',
    price: 1499,
    stock: 12,
    category: 'Western',
    description: 'Stylish denim jacket for casual outings.',
    images: ['/uploads/demo2.jpg'],
    deliveryCharge: 79,
  },
  {
    name: 'Silk Sari',
    price: 2999,
    stock: 8,
    category: 'Traditional',
    description: 'Elegant silk sari with intricate border.',
    images: ['/uploads/demo3.jpg'],
    deliveryCharge: 99,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared products collection');

    const created = await Product.insertMany(products);
    console.log('Inserted products:', created.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
