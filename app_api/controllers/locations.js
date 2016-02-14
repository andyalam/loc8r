var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

//There are some issues with geoNear in Mongoose
//Be careful when tampering with locationsListByDistance
//Sometimes theEarth's functions are needed (currently not in use)
//everything is using meters currently
var theEarth = (function () {
    var earthRadius = 6371; // km, miles is 3959

    var getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };

    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
})();

/* GET list of locations */
//locations?lng=-0.7992599&lat=51.38091
module.exports.locationsListByDistance = function (req, res) {
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
        var locations = [];
        if(err) {
            sendJsonResponse(res, 404, err);
        } else {
            results.forEach(function (doc) {
                locations.push({
                    distance: doc.dis,                  //METERS!
                    name: doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id
                });
            });
            sendJsonResponse(res, 200, locations);
        }
    });
};





/* GET a location by the id */
//locations/:locationid
module.exports.locationsReadOne = function (req, res) {
    if (req.params && req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .exec(function (err, location) {
                if (!location) {
                    console.log('locationid not found');
                    sendJsonResponse(res, 404, {
                       "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJsonResponse(res, 404, err);
                    return;
                }
                console.log(location);
                sendJsonResponse(res, 200, location);
            });
    } else {
        console.log('No locationid specified');
        sendJsonResponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};




/* POST a new location */
//locations
module.exports.locationsCreate = function (req, res) {
    console.log(req.body);
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(','),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
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
    }, function (err, location) {
        if (err) {
            console.log(err);
            sendJsonResponse(res, 400, err);
        } else {
            console.log(location);
            sendJsonResponse(res, 201, location);
        }
    });
};





/* PUT (update) a location */
//locations/:locationid
module.exports.locationsUpdateOne = function (req, res) {
    if (!req.params.locationid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid is required"
        });
        return;
    }
    Loc
      .findById(req.params.locationid)
      .select('-reviews -rating')
      .exec(function(err, location) {
         if(!location) {
             sendJsonResponse(res, 404, {
                 "message": "locationid not found"
             });
             return;
         } else if (err) {
             sendJsonResponse(res, 400, err);
             return;
         }
         location.name = req.body.name;
         location.address = req.body.address;
         location.facilities = req.body.facilities.split(',');
         location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
         location.openingTimes = [{
             days: req.body.days1,
             opening: req.body.opening1,
             closing: req.body.closing1,
             closed: req.body.closed1
         },{
             days: req.body.days2,
             opening: req.body.opening2,
             closing: req.body.closing2,
             closed: req.body.closed2 
         }];
         location.save(function(err, location) {
             if(err) {
                 sendJsonResponse(res, 404, err);
             } else {
                 sendJsonResponse(res, 200, location);
             }
         });
      });
};



/* DELETE a location */
//locations/:locationid
module.exports.locationsDeleteOne = function (req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};