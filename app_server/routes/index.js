var express = require('express');
var router = express.Router();
var cntrlLocations = require('../controllers/locations');
var cntrlOthers = require('../controllers/others');


/* GET home page. */
router.get('/', cntrlLocations.homeList);
router.get('/location', cntrlLocations.locationInfo);
router.get('/location/review/new', cntrlLocations.addReview);

module.exports = router;
