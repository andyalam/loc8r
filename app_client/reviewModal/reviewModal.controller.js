(function() {

  angular
    .module('loc8rApp')
    .controller('reviewModalCtrl', reviewModalCtrl);


  reviewModalCtrl.$inject = ['$uibModalInstance', 'locationData', 'loc8rData'];
  function reviewModalCtrl($uibModalInstance, locationData, loc8rData) {
    var vm = this;
    vm.locationData = locationData;

    vm.modal = {
      cancel : function() {
        $uibModalInstance.dismiss('cancel');
      },
      close: function(data) {
        $uibModalInstance.close(data);
      }
    };

    vm.onSubmit = function() {
      vm.formError = "";
      if (!vm.formData.name || !vm.formData.rating || !vm.formData.reviewText) {
        vm.formError = "All fields required, please try again.";
        return false;
      } else {
        console.log(vm.formData);
        vm.doAddReview(vm.locationData.locationid, vm.formData);
      }
    };

    vm.doAddReview = function(locationid, formData) {
      loc8rData.addReviewById(locationid, {
        author: formData.name,
        rating: formData.rating,
        reviewText: formData.reviewText
      })
        .success(function (data) {
          console.log('Success!');
          vm.modal.close(data);
        })
        .error(function (data) {
          vm.formError = "Your review was not submitted, try again.";
        });
      return false;
    };

  }

})();
