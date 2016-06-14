var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var theEarth = (function() {
  var earthRadius = 3959; //miles
  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };
  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };
  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

var parseLocations = function(docs) {
  var locations = [];

  docs.forEach(function(doc) {
    locations.push({
      distance: doc.dis,                  //METERS!
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });

  return locations;
};

// GET
module.exports.locationsListByDistance = function(req, res, next) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: 16093.4, //16093.4m or 10 miles
    num: 10
  };

  if (!lng || !lat) {
    sendJsonResponse(res, 404, {
      "message": "lng and lat query parameters are required"
    });
    return;
  }

  Loc.geoNear(point, geoOptions, function(err, results, stats){
    if(err) {
      sendJsonResponse(res, 404, err);
    } else {
      sendJsonResponse(res, 200, parseLocations(results));
    }
  });
};

// POST 
module.exports.locationsCreate = function(req, res, next) {
  
};

// GET
module.exports.locationsReadOne = function(req, res, next) {
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {
            'message': 'locationid not found'
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, location);
      });
  } else {
    sendJsonResponse(res, 404, {
      'message': 'No locationid in request'
    });
  }
};

// PUT
module.exports.locationsUpdateOne = function(req, res, next) {
  
};

// DELETE
module.exports.locationsDeleteOne = function(req, res, next) {
  
};