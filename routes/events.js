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
	});
});

router.post('/', function(req, res) {
	EventModel.create(req.body,function(err, event){
		if(err){
			console.log(err);
		}
		else{
			console.log('Yoku Dekimashita');

		}
		res.json(event);
	});
});

router.delete('/:_id', function(req, res) {
	EventModel.findOneAndRemove(req.params, function(err,event){
		if(err){
			console.log(err);
		}
		else{
			console.log('Yoku Dekimashita');
		}
		res.send('delete');
	});
});

router.patch('/:_id', function(req, res) {

	var requestBody = {
		title: 'LOL UPDATED',
		startDate: '2016-11-30T12:00',
		endDate: '2016-11-30T12:00',
		desc: 'LOL UPDATED',
		color: 'red',
		repeat: 'None'
	};

	EventModel.findOneAndUpdate(req.params, requestBody, function(err,event){
		var message;
		if(err){
			message = {error : err}
		}
		else{
			//sending copy of data before changes
			message = {success : event}
		}
		res.send(message);
	});
});

module.exports = router;
