var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/weekly', function(req, res, next) {
  res.render('weekly', { title: 'Express' });
});

module.exports = router;
