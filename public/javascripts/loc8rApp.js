var _isNumeric = function(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
};


// Meters to Freedom units
var formatDistance = function() {
  return function(distance) {
    if (distance && _isNumeric(distance)) {
      return (distance / 1609.34).toFixed(1) + ' miles';
    } else {
      return "?";
    }
  };
};


var ratingStars = function() {
  return {
    scope: {
      thisRating : "=rating"
    },
    templateUrl:  '/angular/rating-stars.html'
  };
};


var loc8rData = function($http) {
  return $http.get('/api/locations?lng=-119.678576&lat=36.811873&maxDistance=10000');
};


var locationListCtrl = function ($scope, loc8rData) {
  $scope.message = "Searching for nearby places..";
  loc8rData
    .success(function(data) {
      $scope.message = data.length > 0 ? "" : "No locations found";
      $scope.data = { locations: data };
    })
    .error(function(e) {
      $scope.message = "Sorry, something's gone wrong.";
      console.log(e);
    });

};



angular
  .module('loc8rApp', [])
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)
  .service('loc8rData', loc8rData);
