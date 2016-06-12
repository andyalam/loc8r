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
  
};

// PUT
module.exports.locationsUpdateOne = function(req, res, next) {
  
};

// DELETE
module.exports.locationsDeleteOne = function(req, res, next) {
  
};