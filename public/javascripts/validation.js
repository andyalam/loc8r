$('#addReview').submit(function(e) {
  var alertMessage = $('.alert.alert-danger')
  alertMessage.hide();
  if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
    if (alertMessage.length) {
      alertMessage.show();
    } else {
      $(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
    }
    return false;
  }
});
