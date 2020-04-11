/**
 * API Endpoints for Covid-19 Tracker Data
 * TODO: cache data with memCache, Redis or DB
 */

const express = require('express');
const fetch = require('node-fetch');

const DataRoutes = express.Router();

const getData = (res, apiURL) => {
  fetch(apiURL)
    .then(data => data.json())
    .then((json) => {
      res.send(json);
    })
    .catch((err) => {
      res.status(404).send({
        error: `Error: ${err}`
      });
    });
};

DataRoutes.get('/us/current', (req, res) => {
  getData(res, 'https://covidtracking.com/api/v1/us/current.json');
});

DataRoutes.get('/states/current', (req, res) => {
  getData(res, 'https://covidtracking.com/api/v1/states/current.json');
});

module.exports = DataRoutes;
