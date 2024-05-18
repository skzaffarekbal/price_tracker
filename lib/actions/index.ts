'use server';

import { revalidatePath } from 'next/cache';
import Product from '../models/product.model';
import { scrapeAmazonProduct } from '../scraper';
import { connectToDB } from '../mongoose';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';
import { User } from '@/types';
import { generateEmailBody, sendEmail } from '../nodemailer';
import mongoose from 'mongoose';

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    await connectToDB();
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapedProduct) return;

    let product = scrapedProduct;
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        originalPrice: scrapedProduct.originalPrice || existingProduct.originalPrice,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    // return JSON.parse(JSON.stringify(existingProduct));

    const newProduct = await Product.findOneAndUpdate({ url: scrapedProduct.url }, product, {
      upsert: true,
      new: true,
    });

    revalidatePath(`/products/${newProduct._id}`);
    return JSON.parse(JSON.stringify(newProduct));
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    await connectToDB();

    const product = await Product.findOne({ _id: productId });
    if (!product) return null;

    return product;
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductByIds(bookmarks: string[]) {
  try {
    console.log('Fetching bookmarks for IDs:', bookmarks);
    await connectToDB();

    const allBookmarks = await Product.find({ _id: { $in: bookmarks } });
    // console.log('Fetched bookmarks:', allBookmarks);

    return allBookmarks || [];
  } catch (error: any) {
    console.error('Failed to fetch bookmarks:', error);
    throw new Error(`Failed to fetch bookmarks: ${error.message}`);
  }
}

export async function getAllProducts() {
  try {
    await connectToDB();

    const products = await Product.find();
    return products;
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getTrendingProducts() {
  try {
    await connectToDB();

    const products = await Product.find({ currentPrice: { $ne: 0 } }).sort({ discount: -1 }).limit(4);
    return products;
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getTopProducts() {
  try {
    await connectToDB();

    const products = await Product.find().sort({ originalPrice: -1 }).limit(4);
    return products;
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    await connectToDB();

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;

    const similarProducts = await Product.find({ _id: { $ne: productId } }).limit(4);

    return similarProducts;
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    await connectToDB();

    const product = await Product.findById(productId);
    if (!product) return null;

    const userExist = product.users.some((user: User) => user.email === userEmail);
    if (!userExist) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, 'WELCOME');

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error: any) {
    throw new Error(`Failed to add email to product: ${error.message}`);
  }
}
