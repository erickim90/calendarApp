/**
 * Created by Kobe on 11/28/2016.
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	title: String,
	startDate: Date,
	endDate: Date,
	desc: String
});

eventSchema.methods.dateValidate = function(){
	//ensure 'this' is set to the new instance of User {username:'Eric'}
	var that = this;
	//create a new promise
	return new Promise(function(resolve, reject) {
		var response = {};

		that.model('event')
			.find({
				$or :[
					{$and: [{"startDate": {$gte : that.startDate}} ,{"startDate": {$lt : that.endDate}}]},
					{$and: [{"endDate": {$lte : that.endDate}} ,{"endDate": {$gt : that.startDate}}]}
				]
			})
			.then(function (result) {
				if(result.length === 0){
					response.result = true;
					response.message = 'Date is Valid, No conflicts';
					response.data = result;
					resolve(response);
				}
				else{
					response.result = false;
					response.message = "Cant's create, Conflict found!";
					response.data = result;
					reject(response);
				}
			});
	});
};

var EventModel = mongoose.model('event', eventSchema);

/* Events */
router.get('/', function(req, res) {
	var output = {
		status: 200
	};
	var query = {};
	//if querystring is passed, this is a weekly request so send +/- 3 days for the week
	if(JSON.stringify(req.query) !== '{}'){
		query = { $and: [ { "startDate": { $lte: moment(req.query.date).endOf('day').add(3, 'day') } },
						  { "startDate": { $gte: moment(req.query.date).startOf('day').subtract(3, 'day') } } ] }
	}
	//else querystring is {} and will return all documents
	EventModel.find(query,function(err,events){
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

router.get('/oneday', function(req, res) {
	var output = {
		status: 200
	};
	//A querystring must be provided in
	var queryStart = moment(req.query.date).startOf('day');
	var queryEnd = moment(req.query.date).endOf('day');
	var query = { $and: [ { "startDate": { $gte: queryStart } },
						  { "startDate": { $lte: queryEnd } } ] };

	EventModel.find(query,function(err,events){
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

router.get('/:eventdate', function(req, res) {
	var output = {
		status: 200
	};

	//the parameter must be a date (YYYY-MM-DD)
	var	query = { $and: [ { "startDate": { $gte: moment(req.params.eventdate).startOf('day') } },
						  { "startDate": { $lte: moment(req.params.eventdate).endOf('day') } } ] };

	EventModel.find(query,function(err,events){
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

	req.body.startDate = moment(req.body.startDate).toISOString();
	req.body.endDate = moment(req.body.endDate).toISOString();

	var createEvent = new EventModel(req.body);

	createEvent.dateValidate()//a promise
		.then(function (resolve) {//on resolve
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
		})
		.catch(function (reject) {//on reject/catch
			output.status = 409;
			output.data = reject;
			res.status(output.status).json(output);
		});
});

router.patch('/:_id', function(req, res) {
	var output = {
		status: 200
	};

	req.body.startDate = moment(req.body.startDate).toISOString();
	req.body.endDate = moment(req.body.endDate).toISOString();

	var updateobj = new EventModel(req.body);

	EventModel.findOne(req.params, function(err,doc){
		updateobj.dateValidate()//a promise
			.then(function (resolve) {//on resolve
				EventModel.findOneAndUpdate(req.params, req.body,function(err, event){
					if(err){
						output.status = 500;
						output.error = err;
						res.status(output.status).json(output);
					}
					else {
						output.status = 201;
						output.data = event;
						res.status(output.status).json(resolve)
					}
				});
			})
			.catch(function (reject) {//on reject/catch\
				var rejectEvent   =  null;
				reject.data.forEach(function(event){
					if(reject.data.length > 1){
						rejectEvent = true
					}
					else if(event._id.toString() === req.params._id){
						if(rejectEvent){}
						else{rejectEvent = false}
					}
				});
				if(rejectEvent){
					output.status = 500;
					output.error = reject;
					res.status(output.status).json(output);
				}
				else{
					EventModel.findOneAndUpdate(req.params, req.body, function(err,doc){
						notSameId = false;
						output.status = 201;
						output.data = reject;
						res.status(output.status).json(output)
					})
				}
			});
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
