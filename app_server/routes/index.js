var express = require('express');
var router = express.Router();
var cntrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', cntrlMain.index);

module.exports = router;
