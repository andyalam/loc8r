angular
  .module('loc8rApp')
  .filter('formatDistance', formatDistance);


  var _isNumeric = function (number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
  };

  // Meters to Freedom units
  function formatDistance() {
    return function(distance) {
      if (distance && _isNumeric(distance)) {
        return (distance / 1609.34).toFixed(1) + ' miles';
      } else {
        return "?";
      }
    };
  };
