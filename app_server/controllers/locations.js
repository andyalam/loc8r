var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};

if (process.env.NODE_ENV == 'production') {
  apiOptions.server = "https://infinite-plateau-97542.herokuapp.com";
}


var renderHomepage = function(req, res, next, responseBody) {
  
  //print error message to browser if applicable
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }

  // Render - error message passed in if applicable
  res.render('locations-list', {
      pageHeader: {
        title: 'Loc8r',
        strapline: 'Find places to work with wifi near you!'
      },
      sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
      locations: responseBody,
      message: message
  });
};


// Meters to Freedom units
var _formatDistance = function(distance) {
  return (distance / 1609.34).toFixed(2) + ' miles';
}

/* GET home page. */
module.exports.homelist = function(req, res, next) {
  
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {
      lng: -119.678576,
      lat: 36.811873,
      maxDistance: 1000000  // Meters
    }
  };

  request(
    requestOptions,
    function(err, response, body) {

      var i, data;
      data = body;
      if (response.statusCode === 200 && data.length) {
        for (i = 0; i < data.length; i++) {
          data[i].distance = _formatDistance(data[i].distance);
        }
      }

      renderHomepage(req, res, next, data);

    }
  );

};

module.exports.locationInfo = function(req, res, next) {
  res.render('location-info', { title: 'Location Info' });
};

module.exports.addReview = function(req, res, next) {
  res.render('location-review-form', { title: 'Add review' });
};