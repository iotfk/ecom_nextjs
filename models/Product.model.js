import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  mrp: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
    required: true,
  },
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  deletedAt: {
    type: Date,
    default: null,
    index: true
  }
}, { timestamps: true });

productSchema.index({ category: 1 });

// use safe dereference for mongoose.models
const models = mongoose.models || {};
const ProductModel = models.Product || mongoose.model('Product', productSchema, 'products');


export default ProductModel;
