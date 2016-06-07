/* GET home page. */
module.exports.homelist = function(req, res, next) {
  res.render('locations-list', {
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: [{
      name: 'Starbucks',
      address: '123 Test St, Clovis, CA',
      rating: 3,
      facilities: ['hot water', 'cold water', 'air'],
      distance: '200m'
    },{
      name: 'Chinese Empire',
      address: '456 Djing Ln, San Francisco, CA',
      rating: 5,
      facilities: ['chinese food', 'japanese food', 'all food'],
      distance: '200000m'
    },{
      name: 'FooBae',
      address: '890 Street Ave, Cupertino, CA',
      rating: 4,
      facilities: ['foo', 'bar', 'goo?'],
      distance: '150000m'
    }]
  });
};

module.exports.locationInfo = function(req, res, next) {
  res.render('location-info', { title: 'Location Info' });
};

module.exports.addReview = function(req, res, next) {
  res.render('location-review-form', { title: 'Add review' });
};