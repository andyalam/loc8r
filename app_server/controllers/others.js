module.exports.about = function(req, res, next) {
    res.render('generic-text', { title: 'About' });
}

module.exports.angularApp = function(req, res, next) {
    res.render('layout', { title: 'Loc8r' });
};
