import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  extractCurrency,
  extractDescription,
  extractOffers,
  extractPrice,
  extractProductFeatures,
  extractProductFullDetail,
  extractProductOverView,
  extractReview,
} from '../utils';
import { BasicObject } from '@/types';

export async function scrapeAmazonProduct(url: string) {
  console.log('🚀 ~ scrapeAmazonProduct ~ url:', url);
  if (!url) return;

  // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_75923c12-zone-pricewise:v4pxf7u26uwn -k "http://lumtest.com/myip.json"

  // BrightData Proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    // console.log('🚀 ~ scrapeAmazonProduct ~ response:', response);

    const $ = cheerio.load(response.data);
    const title = $('#productTitle').text().trim();
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole')
      // $('a.size.base.a-color-price'),
      // $('.a.button-selected .a-color-base')
    );

    const originalPrice = extractPrice(
      // $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen')
      // $('#listPrice'),
      // $('#priceblock_dealprice'),
      // $('.a-size-base.a-color-price')
    );

    const outOfStock =
      $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    const images =
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}';

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($('.a-price-symbol'));

    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

    const offers = extractOffers($);

    let stars = extractReview($, 'stars') || 0;

    let reviewsCount = extractReview($, 'reviewsCount') || 0;

    const description = extractDescription($);

    const productFeatures = extractProductFeatures($);

    const productOverView: BasicObject[] = extractProductOverView($);

    const productFullDetail: BasicObject[] = extractProductFullDetail($);

    // Construct data object with scraped information
    const data = {
      url,
      productFrom: url.includes('amazon') ? 'amazon' : '',
      currency: currency || (url.includes('amazon.in') ? '₹' : '$'),
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [{ price: currentPrice }],
      discount: Number(discountRate),
      category: 'category',
      reviewsCount,
      stars,
      isOutOfStock: outOfStock,
      description,
      productFeatures,
      productOverView,
      productFullDetail,
      offers,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
      sellerBackOut: false,
    };
    // console.log('🚀 ~ scrapeAmazonProduct ~ title:', data);
    return data;
  } catch (error: any) {
    console.log('Failed to scrape product : ', error.message);
    return null;
    // throw new Error('Failed to scrape product : ', error.message);
  }
}
