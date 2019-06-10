var express = require('express');
var router = express.Router();
let lruCache = require('../services/lruCache')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('basic instructions on how to use API here... obvious placeholder is obvious...');
});

router.get('/stats', function(req, res, next) {
  let result = lruCache.lruCacheStats();
  if (result) {
    res.status(200).send(result);
  }
  else {
    res.status(400).send('Unable to retreive stats at this time');
  }
});

router.get('/marsCoords/latitude/:latitude/longitude/:longitude', function (req, res) {
  let latitude = parseInt(req.params.latitude);
  let longitude = parseInt(req.params.longitude);
  let error = {};

  // validate latitude
  if (latitude < -90) {
    error.latitude = `Latitude is below range (-90 to 90) at ${latitude}`;
  }
  else if (latitude > 90) {
    error.latitude = `Latitude is above range (-90 to 90) at ${latitude}`;
  }
  else if (isNaN(latitude)) {
    error.latitude = `Latitude is not a number`;
  }

  // validate longitude
  if (longitude < -180) {
    error.longitude = `Longitude is below range (-180 to 180) at ${longitude}`;
  }
  else if (longitude > 180) {
    error.longitude = `Longitude is above range (-180 to 180) at ${longitude}`;
  }
  else if (isNaN(longitude)) {
    error.longitude = `Longitude is not a number`;
  }

  // if both validate, start doing what we're here for (get the url)
  if (!(error.latitude || error.longitude)) {
    // call for the item from the cache
    let result = lruCache.lruCache(latitude, longitude);
    res.status(200).json(result);
  }
  else {
    res.status(400).send(error);
  }
});

// Delete listing
router.delete('/cache', function(req, res, next) {
  let result = lruCache.lruCacheClear();
  if (result) {
    res.status(200).send(result);
  }
  else {
    res.status(400).json('Unable to clear cache at this time');
  }
});

router.delete('/stats', function(req, res, next) {
  let result = lruCache.lruStatsClear();
  if (result) {
    res.status(200).send(result);
  }
  else {
    res.status(400).send('Unable to clear stats at this time')
  }
});

module.exports = router;
