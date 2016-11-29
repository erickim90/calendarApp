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
	var output = {
		status: 200
	};

	EventModel.find({},function(err,events){
		if(err){
			output.status = 500;
			output.error = err;
			res.status(output.status).json(output);
		}
		else{
			output.data = events;
			res.status(output.status).json(output)
		}
	});
});

router.post('/', function(req, res) {
	var output = {
		status: 200
	};

	EventModel.create(req.body,function(err, event){
		if(err){
			output.status = 500;
			output.error = err;
			res.status(output.status).json(output);
		}
		else {
			output.status = 201;
			output.data = event;
			res.status(output.status).json(output)
		}
	});
});

router.patch('/:_id', function(req, res) {
	var output = {
		status: 200
	};

	var requestBody = {
		title: 'LOL UPDATED',
		startDate: '2016-11-30T12:00',
		endDate: '2016-11-30T12:00',
		desc: 'LOL UPDATED',
		color: 'red',
		repeat: 'None'
	};

	EventModel.findOneAndUpdate(req.params, requestBody, function(err,event){
		if(err){
			output.status = 500;
			output.error = err;
			res.status(output.status).json(output);
		}
		else {
			output.status = 202;
			output.data = event;
			res.status(output.status).json(output)
		}
	});
});

router.delete('/:_id', function(req, res) {
	var output = {
		status: 200
	};

	EventModel.findOneAndRemove(req.params, function(err,event){
		if(err){
			output.status = 500;
			output.error = err;
			res.status(output.status).json(output);
		}
		else {
			output.status = 202;
			output.data = event;
			res.status(output.status).json(output)
		}
	});
});



module.exports = router;
