angular
  .module('loc8rApp')
  .directive('ratingStars', ratingStars);



// EA stands for ElementAttribute
function ratingStars() {
  return {
    restrict: 'EA',
    scope: {
      thisRating : "=rating"
    },
    templateUrl:  '/common/directives/ratingStars/ratingStars.template.html'
  };
}
