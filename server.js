const express = require('express');
const axios = require('axios');
const xmlbuilder = require('xmlbuilder');

const app = express();
const API_KEY = process.env.API_KEY || "YOUR_OPENWEATHERMAP_API_KEY";

app.get('/weather', async (req, res) => {
    const city = req.query.city || "Berlin";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const xml = xmlbuilder
            .create('weather')
            .att('city', data.name)
            .att('temp', data.main.temp)
            .att('humidity', data.main.humidity)
            .att('wind', data.wind.speed)
            .att('condition', data.weather[0].description)
            .end({ pretty: true });

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        res.status(500).send(`<error>Cannot fetch weather</error>`);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("iOS6 Weather Proxy running on port " + port));
