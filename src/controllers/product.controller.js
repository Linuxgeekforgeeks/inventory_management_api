import Product from "../models/product.model.js"
import cloudinary from '../lib/cloudinary.js';
import redis from '../lib/redis.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

// Create a new product with image upload
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      buy_price,
      sell_price,
      isFeatured,
      stock_quantity
    } = req.body;

    let imageUrl = '';
    console.log(req.file)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'inventory_products',
        public_id: `product_${uuidv4()}`,
        resource_type: 'image'
      });
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const newProduct = new Product({
      name,
      description,
      category_id,
      buy_price,
      image: imageUrl,
      sell_price,
      isFeatured: isFeatured || false,
      stock_quantity
    });

    const savedProduct = await newProduct.save();

    // Invalidate Redis cache for featured products if new product is featured
    if (isFeatured) {
      await redis.del('featured_products');
    }

    res.status(201).json({
      success: true,
      data: savedProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: 'Failed to create product'
    });
  } finally {
    if (req.file) await fs.unlink(req.file.path).catch(console.error);
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category_id');
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to retrieve products'
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category_id');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to retrieve product'
    });
  }
};

// Update a product with optional image upload
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      buy_price,
      sell_price,
      isFeatured,
      stock_quantity
    } = req.body;

    const updateData = {
      name,
      description,
      category_id,
      buy_price,
      sell_price,
      isFeatured,
      stock_quantity,
      updatedAt: Date.now()
    };

    // Handle image upload if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products',
        public_id: `product_${uuidv4()}`,
        resource_type: 'image'
      });
      updateData.image = result.secure_url;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('category_id');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Invalidate Redis cache if isFeatured changes
    if (typeof isFeatured !== 'undefined') {
      await redis.del('featured_products');
    }

    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: 'Failed to update product'
    });
  } finally {
    if (req.file) await fs.unlink(req.file.path).catch(console.error);
  }
};

// Delete a product and its associated image
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete image from Cloudinary if it exists
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.findByIdAndDelete(req.params.id);

    // Invalidate Redis cache if the deleted product was featured
    if (product.isFeatured) {
      await redis.del('featured_products');
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to delete product'
    });
  }
};

// Get featured products with Redis caching
export const getFeaturedProducts = async (req, res) => {
  try {
    // Check Redis cache first
    const cachedProducts = await redis.get('featured_products');
    if (cachedProducts) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedProducts),
        message: 'Featured products retrieved from cache'
      });
    }

    // Fetch from MongoDB if not in cache
    const featuredProducts = await Product.find({ isFeatured: true })
      .populate('category_id')
      .lean();

    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No featured products found'
      });
    }

    // Cache the result in Redis with 1-hour expiry
    await redis.set('featured_products', JSON.stringify(featuredProducts), {
      EX: 3600
    });

    res.status(200).json({
      success: true,
      data: featuredProducts,
      message: 'Featured products retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to retrieve featured products'
    });
  }
};