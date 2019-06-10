var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send('basic instructions on how to use API here... obvious placeholder is obvious...');
});

router.get('/stats', function(req, res, next) {
  res.status(200).send('here are our stats for the cache...');
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
    // let result = lruCache(latitude, longitude);
    let result = `Received Lat/Long of: ${latitude}/${longitude}`
    res.status(200).json(result);
  }
  else {
    res.status(400).json(error);
  }
});

// Delete listing
router.delete('/', function(req, res, next) {
  res.status(200).send('annnd we are nuking the cache, cool');
});

module.exports = router;
