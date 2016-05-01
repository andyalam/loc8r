var request = require('request');
var apiOptions = {
    server : 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://still-scrubland-18351.herokuapp.com/';
}

var renderHomepage = function(req, res, responseBody) {
    var message;
    if(!(responseBody instanceof Array)) {
        message = 'API lookup error';
        responseBody = [];
    } else {
        if(!responseBody.length) {
            message = 'No places found nearby.';
        }
    }

    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
        locations: responseBody,
        message: message
    });
}

module.exports.homeList = function(req, res) {
    var requestOptions, path;
    path = '/api/locations';
    requestOptions = {
        url: apiOptions.server + path,
        method: 'GET',
        json: {},
        qs: {
            lng: -119.678576,
            lat: 36.811873,
            maxDistance: 10000
        }
    }
    request(
      requestOptions,
      function(err, response, body) {
          var i, data;
          data = body;
          if (response.statusCode === 200 && data.length) {
            for(i = 0; i < data.length; i++) {
                data[i].distance = _formatDistance(data[i].distance);
            }
          }
          renderHomepage(req, res, body);
      }
    );
}

var _formatDistance = function(distance) {
    return (distance * 0.0006213712).toFixed(2) + ' mi';
}

module.exports.locationInfo = function (req, res) {
    res.render('location-info', {
        title: 'Starcups',
        pageHeader: { title: 'Starcups' },
        sidebar: {
          context: 'is on the Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
          callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: {
            name: 'Starcups',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 0,
            facilities: ['Hot Drinks', 'Food', 'Premium Wifi'],
            coords: { lat: 51.455041, lng: -0.9690884 },
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }],
            reviews: [{
                author: 'Andy Alameddine',
                rating: 5,
                timestamp: '30 January, 2016',
                reviewText: 'What a great place. I can\'t say enough good things about it.'
            }, {
                author: 'Charlie Chaplin',
                rating: 3,
                timestamp: '25 February, 2016',
                reviewText: 'It was okay. Coffee wasn\'t great, wifi was fast.'
            }]
        }
    });
}

module.exports.addReview = function(req, res) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: { title: 'Review Starcups' }
    });
}
