var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var doSetAverageRating = function(location) {

  var i, reviewCount, ratingAverage, ratingTotal; 

  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;

    for (i = 0; i < reviewCount; i++){
      ratingTotal += location.reviews[i].rating;
    }

    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;

  } else {
    location.rating = 0;
  }

  location.save(function(err) {
    if (err)
      console.log(err);
    else
      console.log('Average rating update to: ', ratingAverage);
  });

}

var updateAverageRating = function(locationid) {
  Loc
    .findById(locationid)
    .exec(
      function(err, location) {
        if (err) {
          sendJsonResponse(res, 400, err);
        } else {
          doSetAverageRating(location);
        }
      });
}

var doAddReview = function(req, res, location) {
  if (!location) {

    sendJsonResponse(res, 404, {
      'message': 'locationid not found'
    });

  } else {

    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });

    location.save(function(err, location) {
      var thisReview;
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[ location.reviews.length - 1 ];
        sendJsonResponse(res, 201, thisReview);
      }
    });
  }
};


// POST
module.exports.reviewsCreate = function(req, res, next) {
  var locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(
        function(err, location) {
          if (err) {
            sendJsonResponse(res, 400, err);
          } else {
            doAddReview(req, res, location);
          }
        }
      )
  } else {
    sendJsonResponse(res, 404, {
      'message': 'Not found, locationid required'
    });
  }
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
            });
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
  if (!req.params.locationid || !req.params.reviewid) {
    sendJsonResponse(res, 404, {
      'message': 'Not found, locationid and reviewid are both required'
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(
      function(err, location) {
        var thisReview;

        if (!location) {
          sendJsonResponse(res, 404, {
            'message': 'locationid not found'
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }


        if (location.reviews && location.reviews.length > 0) {
          thisReview = location.reviews.id(req.params.reviewid);

          if (!thisReview) {
            sendJsonResponse(res, 404, { 
              'message': 'reviewid not found'
            });
            return;
          } else {
            thisReview.author = req.body.author;
            thisReview.rating = req.body.rating;
            thisReview.reviewText = req.body.reviewText;

            location.save(function(err, location) {
              if (err) {
                sendJsonResponse(res, 404, err);
                return;
              } else {
                updateAverageRating(location._id);
                sendJsonResponse(res, 200, thisReview);
              }
            });

          }

        } else {
          sendJsonResponse(res, 404, {
            'message': 'no reviews to update'
          });
          return;
        }

      }
    )
};

// DELETE
module.exports.reviewsDeleteOne = function(req, res, next) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJsonResponse(res, 404, {
      'message': 'Not found, locationid and reviewid are both required'
    });
    return;
  }

  Loc
    .findById(req.params.locationid)
    .select('reviews')
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

        if (location.reviews && location.reviews.length > 0) {
          var searchedReview = location.reviews.id(req.params.reviewid);
          if (!searchedReview) {
            sendJsonResponse(res, 404, {
              'message': 'reviewid not found'
            });
            return;
          } else {
            searchedReview.remove();
            location.save(function(err, location) {
              if (err) {
                sendJsonResponse(res, 404, err);
                return;
              } else {
                updateAverageRating(location._id);
                sendJsonResponse(res, 204, null);
              }
            })
          }

        } else {
          sendJsonResponse(res, 404, {
            'message': 'No reviews available to delete any'
          });
          return;
        }

      }
    )

};