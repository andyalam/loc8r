(function() {
  angular
    .module('loc8rApp')
    .directive('footerGeneric', footerGeneric);


  function footerGeneric() {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/footer/footerGeneric.directive.html',
    };
  }

})();
