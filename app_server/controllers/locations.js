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


var renderDetailPage = function (req, res, locDetail) {
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: { title: locDetail.name },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you',
    },
    location: locDetail
  });
};


var renderReviewForm = function(req, res, locDetail) {
  res.render('location-review-form', {
    title: 'Review ' + locDetail.name + ' on Loc8r',
    pageHeader: { title: 'Review ' + locDetail.name }
  });
};


var getLocationInfo = function(req, res, callback) {
  var requestOptions, path;
  path = '/api/locations/' + req.params.locationid;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };

  request(
    requestOptions,
    function(err, response, body) {
        var data = body;
        if (response.statusCode === 200) {
          data.coords = {
            lng : body.coords[0],
            lat : body.coords[1]
          }
          callback(req, res, data);
        } else {
          _showError(req, res, response.statusCode);
        }
    }
  );
}


// Meters to Freedom units
var _formatDistance = function(distance) {
  return (distance / 1609.34).toFixed(1) + ' miles';
};


var _showError = function(req, res, status) {
  var title, content;

  if (status === 404) {
    title = '404, page not found';
    content = 'Oh dear. Looks like we can\'t find this page. Sorry.';
  } else {
    title = status + ', something\s gone wrong.';
    content = 'Something, somewhere, has gone just a little bit wrong.';
  }
  res.status(status);
  res.render( 'generic-text', {
    title: title,
    content: content
  });
};

/******************************************************************************/

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
  getLocationInfo(req, res, function(req, res, responseData) {
    renderDetailPage(req, res, responseData);
  });

};

module.exports.addReview = function(req, res, next) {
  getLocationInfo(req, res, function(req, res, responseData) {
    renderReviewForm(req, res, responseData);
  });
};

module.exports.doAddReview = function(req, res, next) {
  var requestOptions, path, locationid, postdata;

  locationid = req.params.locationid;
  path = '/api/locations/' + locationid + '/reviews';

  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };

  requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: postdata
  };

  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 201) {
        res.redirect('/location/'+ locationid);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );

};
