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
	console.log(req.body);
	// var newEvent = new EventModel(req.body);
	//
	// newEvent.save(function(err, event){
	// 	if(err){
	// 		console.log(err);
	// 	}
	// 	else{
	// 		console.log('Yoku Dekimashita', event);
	// 		res.json(event);
	// 	}
	// })

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

router.delete('/', function(req, res) {
	res.send('delete')
});

router.patch('/', function(req, res) {
	res.send('patch')
});

module.exports = router;
