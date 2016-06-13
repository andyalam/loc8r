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
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(
        function(err, location) {
          var content, review;
          if (!location) {
            sendJsonResponse(res, 404, {
              'message': 'locationid not found'
            });
            return;
          } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
          }
          // Location found, proceed to find review
          if (location.reviews && location.reviews.length > 0) {
            review = location.reviews.id(req.params.reviewid);
            if (!review) {
              sendJsonResponse(res, 404, {
                'message': 'reviewid not found'
              });
            } else {
              content = {
                location: {
                  name: location.name,
                  id: req.params.locationid
                },
                review: review
              };
              sendJsonResponse(res, 200, content);
            }
          } else {
            sendJsonResponse(res, 404, {
              'message': 'No reviews found'
            })
          }
        })
  } else {
    sendJsonResponse(res, 404, {
      'message': 'Not found, locationid and reviewid are both required'
    });
  }
};

// PUT
module.exports.reviewsUpdateOne = function(req, res, next) {
  
};

// DELETE
module.exports.reviewsDeleteOne = function(req, res, next) {
  
};