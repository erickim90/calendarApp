var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Calendar App' });
});
//TODO hashtags can do this without page reload (hard mode)
router.get('/weekly', function(req, res, next) {
  var queryDate = moment(req.query.date).toISOString();
  var dateHeader = moment(req.query.date).format('YYYY MMMM');
  res.render('weekly', {queryDate, dateHeader});
});

router.get('/daily', function(req, res, next) {
  var queryDate = moment(req.query.date).toISOString();
  var dateHeader = moment(req.query.date).format('YYYY MMMM');
  res.render('daily', {queryDate, dateHeader});
});

module.exports = router;