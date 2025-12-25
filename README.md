# API Integration Assignment

## Overview
A web application that integrates four different APIs to display:
1. Random user profile
2. Country information
3. Currency exchange rates
4. Latest news headlines

## Quick Start

1. **Install packages:**
   ```bash
   npm install
Get API keys (free):

ExchangeRate-API

NewsAPI

Create .env file (in project root) with the following content:

text
EXCHANGERATE_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
PORT=3000
Run the app:


node app.js
Open browser: http://localhost:3000

How to Use
Click the "Get Random User" button to see:

Random user profile with photo

Country information and flag

Currency exchange rates (USD & KZT)

Latest news from that country

Project Files
api-assignment/
├── app.js              # Server code
├── index.html          # Main page
├── README.md           # This file
├── .env                # API keys (create this)
├── package.json        # Dependencies
├── public/             # CSS & JavaScript
│   ├── css/styles.css
│   └── js/main.js
└── node_modules/       # Installed packages
Fix Common Issues
Page not loading? Check browser console for errors.

API not working? Verify .env file has correct keys.

Styling broken? Check if CSS file path is correct.

Student Information
Student: Kazhymukhamet Birkhanym

Group: SE - 2414

Subject: Back End

Date: 25.12.2025




