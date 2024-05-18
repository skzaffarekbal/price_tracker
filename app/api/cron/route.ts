import Product from '@/lib/models/product.model';
import { connectToDB } from '@/lib/mongoose';
import { generateEmailBody, sendEmail } from '@/lib/nodemailer';
import { scrapeAmazonProduct } from '@/lib/scraper';
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from '@/lib/utils';
import { NextResponse } from 'next/server';

export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDB();

    const products = await Product.find({});
    if (!products) throw new Error('No Products Found.');

    // Scrap Latest products details and update DB.
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
        let updatedProduct;

        if (!scrapedProduct) {
          console.log('Failed to scrape product / Product is no more saleable.', {
            scrapedProduct: scrapedProduct,
          });
          // return currentProduct;
          // throw new Error('No Product Found');

          const product = await Product.findById(currentProduct._id);
          if (!product) return null;

          product.priceHistory.push({ price: 0 });
          product.sellerBackOut = true;
          product.currentPrice = 0;
          product.discount = 0;

          await product.save();
          return product;
        }

        const updatedPriceHistory: any = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct?.currentPrice || 0 },
        ];

        const product = {
          ...(scrapedProduct || currentProduct),
          sellerBackOut: !scrapedProduct ? true : false,
          originalPrice: scrapedProduct?.originalPrice || currentProduct.originalPrice,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        updatedProduct = await Product.findOneAndUpdate({ url: product.url }, product, {
          new: true,
        });

        // Check Each Product Status and send mail Accordingly.
        const emailNotifType = getEmailNotifType(product, currentProduct);

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(productInfo, emailNotifType);

          const userEmails = updatedProduct.users.map((user: any) => user.email);

          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );

    return NextResponse.json({
      message: 'Ok',
      data: updatedProducts,
    });
  } catch (error) {
    console.log('🚀 ~ GET ~ error: ', error);
  }
}
