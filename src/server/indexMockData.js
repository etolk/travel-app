const express = require("express");

const app = express();

app.get('/test/:location/:startdate/:enddate', async (req, res) => {
    res.json({city: req.params.location,
              country: 'country',
              img: 'https://pixabay.com',
              temp_avg: 20,
              temp_min: 10,
              temp_max: 30})
  })

module.exports = app;