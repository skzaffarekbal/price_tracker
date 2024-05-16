export type PriceHistoryItem = {
  price: number;
  date: string;
};

export type User = {
  email: string;
};

export type BasicObject = {
  keyName: string;
  keyValue: string;
};

export type Offers = {
  title: string;
  content: string;
  offerCount: string;
};

export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discount: number;
  description: string;
  productFeatures: string[] | [];
  productFullDetail: BasicObject[] | [];
  productOverView: BasicObject[] | [];
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: Boolean;
  sellerBackOut: Boolean;
  users?: User[];
  offers?: Offers[];
  productFrom?: string;
};

export type NotificationType = 'WELCOME' | 'CHANGE_OF_STOCK' | 'LOWEST_PRICE' | 'THRESHOLD_MET';

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};
