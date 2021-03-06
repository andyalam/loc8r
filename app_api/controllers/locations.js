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
  var distanceLimit = parseFloat(req.query.maxDistance);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: distanceLimit, //16093.4m or 10 miles
    num: 10
  };

  if ((!lng && lng !== 0) || (!lat && lat !== 0 )) {
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
    Loc.create({
      name: req.body.name,
      address: req.body.address,
      facilities: req.body.facilities.split(","),
      coords: [ parseFloat(req.body.lng), parseFloat(req.body.lat) ],
      openingTimes: [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1,
      }, {
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2,
      }]
    }, function(err, location) {
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        console.log(location);
        sendJsonResponse(res, 201, location);
      }
    });
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
  if (!req.params.locationid) {
    sendJsonResponse(res, 404, {
      'message': 'Not found, locationid is required'
    });
    return;
  }

  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(
      function(err, location) {

        if (!location) {
          sendJsonResponse(res, 404, {
            'message': 'locationid not found'
          });
          return;

        } else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }

        location.name = req.body.name;
        location.address = req.body.address;
        if ((typeof req.body.facilities) == 'string')
          location.facilities = req.body.facilities.split(',');
        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
        location.openingTimes = [{
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1
        }, {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2
        }];

        location.save(function(err, location) {
          if (err) {
            sendJsonResponse(res, 404, err);
          } else {
            sendJsonResponse(res, 200, location);
          }
        });

      }
    );

};

// DELETE
module.exports.locationsDeleteOne = function(req, res, next) {
  var locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findByIdAndRemove(locationid)
      .exec(
        function(err, location) {
          if (err) {
            sendJsonResponse(res, 404, err);
            return;
          }
          sendJsonResponse(res, 204, null);
        }
      )
  } else {
    sendJsonResponse(res, 404, {
      'message': 'No locationid'
    });
  }
};
