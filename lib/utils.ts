import { BasicObject, PriceHistoryItem, Product } from '@/types';

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

const THRESHOLD_PERCENTAGE = 40;

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');

      let firstPrice;

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return '';
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText || '';
}

// Extracts description from two possible elements from amazon
export function extractDescription($: any) {
  // these are possible elements holding description of the product
  const selectors = [
    '.a-unordered-list .a-list-item',
    '.a-expander-content p',
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join('\n');
      return textContent;
    }
  }

  // If no matching elements were found, return an empty string
  return '';
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      if (priceList[i].price != 0) lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const length = priceList.reduce((acc, curr) => (acc += curr.price ? 1 : 0), 0);
  const averagePrice = sumOfPrices / length || 0;

  return averagePrice;
}

export const getEmailNotifType = (scrapedProduct: Product, currentProduct: Product) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discount >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/*------------------------------------------------------------------------*/

// Extracts product reviews and stars.
export function extractReview($: any, attribute: string) {
  let text = '';
  if (attribute === 'stars') {
    text =
      $('.reviewCountTextLinkedHistogram').attr('title') ||
      $('.AverageCustomerReviews span.a-size-medium.a-color-base').text();

    return text ? Number(text.split(' ')[0]) : 0;
  } else if (attribute === 'reviewsCount') {
    text =
      $('#acrCustomerReviewLink span#acrCustomerReviewText').text() ||
      $('.averageStarRatingNumerical span').text();

    return text ? parseInt(text.split(' ')[0].replace(',', '')) : 0;
  }
}

// Extract Product Feature
export function extractProductFeatures($: any) {
  let productFeatures: string[] = $(
    '#featurebullets_feature_div #feature-bullets ul.a-unordered-list.a-vertical.a-spacing-mini li.a-spacing-mini span.a-list-item'
  )
    .map((index: number, element: any) => $(element).text().trim())
    .get();

  return productFeatures?.length ? productFeatures : [];
}

// Extract Product Overview
export function extractProductOverView($: any) {
  let productOverView: BasicObject[] = [];
  // Extract key-value pairs from each <tr> element within the table
  $('div#productOverview_feature_div table.a-normal.a-spacing-micro tbody tr').each(
    (index: number, element: any) => {
      // Get the text content of the first <td> element as the key
      const keyName = $(element).find('td:nth-child(1)').text().trim();

      // Get the text content of the second <td> element as the value
      const keyValue = $(element).find('td:nth-child(2)').text().trim();

      // Add the key-value pair to the details object
      productOverView.push({ keyName, keyValue });
    }
  );

  $('.product-facts-detail').each((index: number, element: any) => {
    // Get the text content of the left column (.a-fixed-left-grid-col.a-col-left) as the keyName
    const keyName = $(element).find('.a-fixed-left-grid-col.a-col-left').text().trim();

    // Get the text content of the right column (.a-fixed-left-grid-col.a-col-right) as the keyValue
    const keyValue = $(element).find('.a-fixed-left-grid-col.a-col-right').text().trim();

    // Add the keyName and keyValue to the details array as an object
    productOverView.push({ keyName, keyValue });
  });

  return productOverView;
}

// Function to extract key-value pairs from a table element
const extractKeyValuePairs = ($: any, $table: any, isHead: boolean = false) => {
  const keyValuePairs: BasicObject[] = [];

  // Iterate over each table row (tr) in the table
  $table.find('tr').each((index: number, row: any) => {
    // Extract the key (first td) and value (second td) from each row
    let key, value;
    if (isHead) {
      key = $(row).find('th').text().trim();
      value = $(row).find('td').text().trim();
    } else {
      key = $(row).find('td:first-child').text().trim();
      value = $(row).find('td:last-child').text().trim();
    }

    // Add the key-value pair to the array
    if (!['Customer Reviews', 'Best Sellers Rank'].includes(key))
      keyValuePairs.push({ keyName: key, keyValue: value });
  });

  return keyValuePairs;
};

export function extractProductFullDetail($: any) {
  let productFullDetail: BasicObject[] = [];
  const selectors = [
    {
      element: "table[class='a-bordered']",
      isHead: false,
    },
    {
      element: 'table.prodDetTable',
      isHead: true,
    },
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    $(selector.element).each((index: number, table: any) => {
      // Convert the current table to a Cheerio object
      const $table = $(table);

      // Extract key-value pairs from the current table
      const keyValuePairs = extractKeyValuePairs($, $table, selector.isHead);

      // Add the extracted key-value pairs to the main array
      productFullDetail.push(...keyValuePairs);
    });
  }

  return productFullDetail;
}

export function extractOffers($: any) {
  const offers: { title: string; content: string; offerCount: string }[] = [];

  $('div#vsxoffers_feature_div div.a-cardui.vsx__offers-holder div.a-carousel-viewport ol li').each(
    (index: number, element: any) => {
      const title = $(element).find('.a-spacing-micro.offers-items-title').text().trim();
      const content = $(element).find('.a-spacing-none.offers-items-content').text().trim();
      const offerCount = $(element).find('.vsx-offers-count').text().trim();

      offers.push({ title, content, offerCount });
    }
  );
  return offers;
}
