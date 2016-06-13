var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

// GET
module.exports.locationsListByDistance = function(req, res, next) {
  sendJsonResponse(res, 200, { 'test': 'hello api'});
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