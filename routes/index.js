var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Monthly Calendar' });
});

router.post('/createEvent',function(req,res){
  res.status(200).send(req.body)
});

router.get('/createEvent',function(req,res){
  res.status(200).send({response:"success"})
});

module.exports = router;
