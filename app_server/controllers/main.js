/* GET home page. */
module.exports.homepageController = function(req, res, next) {
  res.render('index', { title: 'Express' });
};
