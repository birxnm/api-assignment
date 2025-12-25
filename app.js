const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static(__dirname));

const getCountryCode = (country) => {
    const codes = {
        'united states': 'us', 'usa': 'us',
        'united kingdom': 'gb', 'uk': 'gb',
        'canada': 'ca', 'australia': 'au',
        'germany': 'de', 'france': 'fr',
        'japan': 'jp', 'china': 'cn',
        'india': 'in', 'brazil': 'br',
        'kazakhstan': 'kz', 'russia': 'ru',
        'italy': 'it', 'spain': 'es',
        'mexico': 'mx', 'south korea': 'kr'
    };
    return codes[country.toLowerCase()] || 'us';
};

app.get('/random-user', async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        const user = response.data.results[0];
        res.json({
            user: {
                name: `${user.name.first} ${user.name.last}`,
                gender: user.gender,
                picture: user.picture.large,
                age: user.dob.age,
                dob: new Date(user.dob.date).toLocaleDateString(),
                city: user.location.city,
                country: user.location.country,
                address: `${user.location.street.number} ${user.location.street.name}`
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not get user' });
    }
});

app.get('/country-info/:country', async (req, res) => {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${req.params.country}`);
        const country = response.data[0];
        
        let currencyCode = 'Unknown';
        let currencyName = 'Unknown';
        if (country.currencies) {
            currencyCode = Object.keys(country.currencies)[0];
            currencyName = country.currencies[currencyCode].name;
        }
        
        res.json({
            name: country.name.common,
            capital: country.capital ? country.capital[0] : 'Unknown',
            languages: country.languages ? Object.values(country.languages).join(', ') : 'Unknown',
            currencyCode: currencyCode,
            currencyName: currencyName,
            flag: country.flags.png
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not get country info' });
    }
});

app.get('/exchange-rate/:currency', async (req, res) => {
    const apiKey = process.env.EXCHANGERATE_API_KEY;
    if (!apiKey) return res.json({ usd: 'API key missing', kzt: 'API key missing' });
    
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${req.params.currency}`);
        res.json({
            usd: response.data.conversion_rates.USD.toFixed(2),
            kzt: response.data.conversion_rates.KZT.toFixed(2)
        });
    } catch (error) {
        res.json({ usd: 'Error', kzt: 'Error' });
    }
});

app.get('/news/:country', async (req, res) => {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return res.json([]);
    
    try {
        const countryCode = getCountryCode(req.params.country);
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: countryCode,
                apiKey: apiKey,
                pageSize: 5
            }
        });
        
        const news = response.data.articles.slice(0, 5).map(article => ({
            title: article.title || 'No title',
            description: article.description || 'No description',
            url: article.url || '#',
            image: article.urlToImage,
            source: article.source?.name || 'Unknown'
        }));
        
        res.json(news);
    } catch (error) {
        res.json([]);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Make sure you have:');
    console.log('1. index.html in the same folder as app.js');
    console.log('2. Your API keys in .env file');
});