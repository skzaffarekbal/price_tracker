import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    priceHistory: [
      {
        price: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    lowestPrice: { type: Number },
    highestPrice: { type: Number },
    averagePrice: { type: Number },
    discount: { type: Number },
    description: { type: String },
    productFeatures: [String],
    productFullDetail: [
      {
        keyName: { type: String, required: true },
        keyValue: { type: String, required: true },
      },
    ],
    productOverView: [
      {
        keyName: { type: String, required: true },
        keyValue: { type: String, required: true },
      },
    ],
    category: { type: String },
    reviewsCount: { type: Number },
    stars: { type: Number },
    isOutOfStock: { type: Boolean, default: false },
    users: [{ email: { type: String, required: true }, trackPrice: { type: Number } }],
    productFrom: { type: String, default: 'amazon' },
    offers: [
      {
        title: { type: String },
        content: { type: String },
        offerCount: { type: String },
      },
    ],
    sellerBackOut: { type: Boolean, default: false },
    default: [],
  },
  { timestamps: true, strict: false }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
