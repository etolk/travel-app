// for creating enviroment variables
const dotenv = require("dotenv").config();

// for using the fetch requests from the server
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const express = require("express");

const app = express();

app.use(express.static("dist"));

// for image placeholder
app.use(express.static("src/client/media"));

app.get("/", function (req, res) {
    res.sendFile("dist/index.html");
});

// designates what port the app will listen to for incoming requests
const port = process.env.PORT || 8081;
app.listen(port, function () {
    console.log(`The App listening on port ${port}!`);
});

// get data from client, make an API call and return the data to client
app.get("/getData/:location/:startDate/:endDate", async (req, res) => {

    // global data holder object
    let data = {};

    const location = req.params.location;
    const encodedLocation = encodeURIComponent(location);
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;

    // async request helper function
    const getApiData = async (url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            return json;
        } catch (error) {
            console.log(error);
        }
    };

    // geonames API for getting geo cordinates
    const geoNamesURL = "http://api.geonames.org/searchJSON?maxRows=1&orderby=population";
    const username = `&username=${process.env.GEONAMES_USERNAME}`;
    const nameEquals = `&name_equals=${encodedLocation}`;
    const url1 = geoNamesURL + username + nameEquals;

    let result1 = await getApiData(url1);

    // response validator
    if (result1.geonames.length !== 0) {

        // pixabay API for getting images
        const country = result1.geonames[0].countryName;
        const encodedCountry = encodeURIComponent(country);
        const pixabayURL =
            "https://pixabay.com/api/?image_type=photo&per_page=3&orientation=horizontal";
        const apiKey = `&key=${process.env.PIXABAY_KEY}`;
        const q = `&q=${encodedLocation}`;
        const url2 = pixabayURL + apiKey + q;

        let result2 = await getApiData(url2);

        // weatherbit API for getting historical weather data
        const weatherbitURL = "https://api.weatherbit.io/v2.0/history/daily?";
        const key = `key=${process.env.WEATHERBIT_KEY}`;
        const lat = "&lat=" + result1.geonames[0].lat;
        const lon = "&lon=" + result1.geonames[0].lng;
        const date = `&start_date=${startDate}&end_date=${endDate}`;
        const url3 = weatherbitURL + key + lat + lon + date;

        let result3 = await getApiData(url3);

        data["city"] = result1.geonames[0].name;
        data["country"] = result1.geonames[0].countryName;

        // if request is correct but weatherbit doesn't return an image replace it by placeholder image
        if (typeof result2.hits[0] !== "undefined") {
            data["img"] = result2.hits[0].webformatURL;
        } else {
            data["img"] = "/img-placeholder.svg";
        }
        data["temp_avg"] = result3.data[0].temp;
        data["temp_max"] = result3.data[0].max_temp;
        data["temp_min"] = result3.data[0].min_temp;

        res.json(data);

        // return data object with error if responce fails
    } else {
        data["error"] = "Please enter correct city";
        res.json(data);
    }
});