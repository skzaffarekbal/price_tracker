# 📊 PriceTracker

🔗 Live Demo: https://pricetracker-lilac.vercel.app/

**PriceTracker** is a smart web application that helps users track
product prices from Amazon.\
Users can paste an Amazon product link and the system automatically
extracts product details, stores price history, visualizes trends, and
notifies users when the price drops.

Built using **Next.js, MongoDB, TypeScript, and TailwindCSS**, the
project combines **web scraping, automation, and data visualization**
into one powerful tool.

------------------------------------------------------------------------

# 🚀 Features

✨ **Amazon Product Scraping**\
Extract product details such as title, price, and image from Amazon
links.

📉 **Price History Tracking**\
Store daily price updates in MongoDB to build historical price data.

📊 **Beautiful Price Charts**\
Interactive price trend charts using Recharts.

📧 **Price Drop Alerts**\
Users can subscribe via email and get notified when a product price
drops.

🛒 **Affiliate Integration**\
Each product page includes an Amazon affiliate link for purchasing tracked products while generating referral traffic.

🤖 **Automated Daily Price Updates**\
A cron job runs every day to fetch the latest product price.

🛡 **Captcha Bypass using Bright Data**\
Bright Data proxy network helps bypass scraping restrictions.

------------------------------------------------------------------------

# 🧠 How It Works

1.  User submits an **Amazon product URL**
2.  Backend fetches the page and scrapes product information
3.  Product data is stored in **MongoDB Atlas**
4.  A **daily cron job** updates product prices
5.  Historical price data is stored
6.  **Recharts** visualizes the price trend
7.  If price drops, **Nodemailer sends an email alert**

------------------------------------------------------------------------

# 🛠 Tech Stack

## Frontend

**Next.js 14** - Full-stack React framework - API routes and server
components

**React 18** - Component-based UI library

**TailwindCSS** - Utility-first CSS framework for fast UI development

**Headless UI** - Accessible UI components without styling constraints

**React Responsive Carousel** - Responsive carousel for product images

**Recharts** - Chart library for visualizing price history

------------------------------------------------------------------------

## Backend & Data

**MongoDB Atlas** - Cloud database for storing product and price history

**Mongoose(ODM)** - MongoDB object modeling for Node.js

**Axios** - HTTP client for fetching product pages

**Cheerio** - Server-side HTML parser used for web scraping

**Moment.js** - Date formatting and manipulation

**Nodemailer** - Sends automated email alerts when prices drop

------------------------------------------------------------------------

## Infrastructure

**Bright Data** - Proxy service used to bypass scraping restrictions and
captchas

**Cron-job.org** - Runs scheduled jobs to update product prices daily

**Vercel** - Deployment platform for the Next.js application

**Vercel Speed Insights** - Performance monitoring tool

------------------------------------------------------------------------

# 📦 Installation

Clone the repository

    git clone git@github.com:skzaffarekbal/price_tracker.git
    cd pricetracker

Install dependencies

    npm install

Run the development server

    npm run dev

Open the app:

    http://localhost:3000

------------------------------------------------------------------------

# ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add:

    BRIGHT_DATA_USERNAME=your_brightdata_username
    BRIGHT_DATA_PASSWORD=your_brightdata_password

    MONGODB_URI=your_mongodb_connection_string

    EMAIL_ACCOUNT=your_email_address
    EMAIL_PASSWORD=your_email_password

### Environment Variables Description

  Variable               Description
  ---------------------- --------------------------------------
  BRIGHT_DATA_USERNAME   Bright Data proxy username
  BRIGHT_DATA_PASSWORD   Bright Data proxy password
  MONGODB_URI            MongoDB Atlas connection string
  EMAIL_ACCOUNT          Email used for sending notifications
  EMAIL_PASSWORD         Email password or app password

⚠️ Never commit your `.env` file to GitHub.

------------------------------------------------------------------------

# 📜 Available Scripts

### Development

    npm run dev

Runs the Next.js development server.

### Build

    npm run build

Builds the production application.

### Start

    npm run start

Runs the production server.

### Lint

    npm run lint

Runs ESLint to check code quality.

------------------------------------------------------------------------

# 📊 Data Visualization

Price history is visualized using **Recharts**, helping users understand
price movements over time.

Charts display:

-   Price vs Date
-   Historical price trends
-   Best buying opportunities

------------------------------------------------------------------------

# 📬 Price Drop Notification System

Users can subscribe with their email address.

When a price drop is detected:

1.  System compares historical price data
2.  Detects a price decrease
3.  **Nodemailer automatically sends a notification email**

This helps users buy products at the **best possible price**.

------------------------------------------------------------------------

# 🔐 Security & Best Practices

✔ Proxy rotation using Bright Data\
✔ Environment variables for secrets\
✔ Secure MongoDB connection\
✔ Email authentication via SMTP

------------------------------------------------------------------------

# 🌟 Future Improvements

-   Multi-store price tracking (Flipkart, Walmart, etc.)
-   AI price prediction
-   Browser extension
-   User dashboard for tracked products
-   Mobile optimization

------------------------------------------------------------------------

# 👨‍💻 Author

**SK Zaffar Ekbal**\
Frontend / Full Stack Engineer

React • Next.js • TypeScript • Node.js

LinkedIn: https://www.linkedin.com/in/sk-zaffar-ekbal
