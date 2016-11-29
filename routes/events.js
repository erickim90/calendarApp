/**
 * Created by Kobe on 11/28/2016.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	title: String,
	startDate: Date,
	endDate: Date,
	desc: String
});

var EventModel = mongoose.model('event', eventSchema);
var debug = EventModel.find;

/* Events */
router.get('/', function(req, res) {
	console.log('got here');
	EventModel.find({},function(err,events){
		res.send(events)
	})
});

router.post('/', function(req, res) {
	EventModel.create(req.body,function(err, event){
		if(err){
			console.log(err);
		}
		else{
			console.log('Yoku Dekimashita', event);
			res.json(event);
		}
	})
});

router.delete('/:_id', function(req, res) {
	EventModel.findOneAndRemove(req.params, function(err,event){
		if(err){
			console.log(err);
		}
		else{
			console.log('Yoku Dekimashita', event);
		}
	});
	res.send('delete');

});

router.patch('/', function(req, res) {
	res.send('patch')
});

module.exports = router;
