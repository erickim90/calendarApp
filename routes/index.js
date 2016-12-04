var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//rehitting the same route, will page reload?
//hashtags can do this without page reload (hard mode)
router.get('/weekly', function(req, res, next) {
  var querystring = req.query.date;
  var queryDate;
  var dateHeader;
  queryDate = moment(querystring).toISOString();
  //passed in {} returns current date

  dateHeader = moment(queryDate).format('YYYY MMMM');
  res.render('weekly', {queryDate, dateHeader});
});

router.get('/daily', function(req, res, next) {
  var querystring = req.query.date;
  var queryDate;
  var dateHeader;
  queryDate = moment(querystring).toISOString();
  //passed in {} returns current date

  dateHeader = moment(queryDate).format('YYYY MMMM');
  res.render('daily', {queryDate, dateHeader});
});


module.exports = router;
