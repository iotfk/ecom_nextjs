import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
 
  color: {
    type: String,
    required: true,
    trim: true
  },

  size: {
    type: String,
    required: true,
    trim: true  
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
  sku: {
    type: String,
    required: true,
    unique: true
  },
  
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true
  }],
 
  deletedAt: {
    type: Date,
    default: null,
    index: true
  }
}, { timestamps: true });

// use safe dereference for mongoose.models
const models = mongoose.models || {};
const ProductVariantModel = models.ProductVariant || mongoose.model('ProductVariant', ProductVariantSchema, 'productVariants');


export default ProductVariantModel;
