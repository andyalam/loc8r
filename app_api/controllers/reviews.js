var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

// POST
module.exports.reviewsCreate = function(req, res, next) {
  
};

// GET
module.exports.reviewsReadOne = function(req, res, next) {
  
};

// PUT
module.exports.reviewsUpdateOne = function(req, res, next) {
  
};

// DELETE
module.exports.reviewsDeleteOne = function(req, res, next) {
  
};