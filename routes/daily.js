/**
 * Created by Kobe on 11/17/2016.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('daily', { title: 'Daily Calendar' });
});

module.exports = router;