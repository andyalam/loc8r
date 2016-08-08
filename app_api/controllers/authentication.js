var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function() {
  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJsonResponse(res, 400, {
      "message": "All fields required."
    });
    return;
  }

  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.save(function(err) {
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      token = user.generateJwt();
      sendJsonResponse(res, 200, {
        "token": token
      });
    }
  });

};


module.exports.login = function() {

};
