var _isNumeric = function(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}


// Meters to Freedom units
var _formatDistance = function() {
  return function(distance) {
    if (distance && _isNumeric(distance)) {
      return (distance / 1609.34).toFixed(1) + ' miles';
    } else {
      return "?";
    }
  }
};


var locationListCtrl = function ($scope) {
  $scope.data = {
    locations: [{
      name: "Mickeys Yogurt",
      address: "219 Shaw Ave Ste A, Clovis, CA 93611",
      rating: 5,
      facilities: [
        "Yogurt",
        "Assorted Candy",
        "Fruit"
      ],
      distance: "0.39",
      _id: "56be06d7a628c8938aba0455"
    }, {
      name: "Kuppa Joy Coffee House",
      address: "518 Clovis Ave, Clovis, CA 93612",
      rating: 4,
      facilities: [
        "Hot Drinks",
        "Food",
        "Premium Wifi"
      ],
      distance: "1.12",
      _id: "56be099fa628c8938aba0459"
    }]
  }

};



angular
  .module('loc8rApp', [])
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance);
