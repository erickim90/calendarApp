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
		that.model('event')
			.find({
				$or :[
					{$and: [{"startDate": {$gte : that.startDate}} ,{"startDate": {$lt : that.endDate}}]},
					{$and: [{"endDate": {$lte : that.endDate}} ,{"endDate": {$gt : that.startDate}}]}
				]
			})
			.then(function (result) {
				if(result.length === 0){
						resolve('No Conflicts!');
				}
				else{
					var obj = {
						message : "Cant's create, conflict found!",
						data : result
					};
					reject(obj);
				}
			});
	});
};

var EventModel = mongoose.model('event', eventSchema);

router.post('/test', function(req, res) {
	var eric = new EventModel(req.body);

	eric.dateValidate()//a promise
		.then(function (resolve) {//on resolve
			res.send(resolve)
		})
		.catch(function (reject) {//on reject/catch
			res.send(reject)
		});
});

/* Events */
router.get('/', function(req, res) {
	var output = {
		status: 200
	};

	var query = {};

	if(JSON.stringify(req.query) !== '{}'){
		query = { $and: [ { "startDate": { $lte: moment(req.query.date).startOf('day').add(3, 'day') } },
						  { "startDate": { $gte: moment(req.query.date).endOf('day').subtract(3, 'day') } } ] }
	}

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

	var query = {};

	if(JSON.stringify(req.query) !== '{}'){
		query = { $and: [ { "startDate": { $gte: moment(req.query.date).startOf('day') } },
						  { "startDate": { $lte: moment(req.query.date).endOf('day') } } ] }
	}

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

	var param  = moment(req.params.eventdate).startOf('day');
	var param2 = moment(req.params.eventdate).endOf('day');

	var	query = { $and: [ { "startDate": { $gte: param } },
						  { "startDate": { $lte: param2 } } ] };

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
			output.status = 500;
			output.error = reject;
			res.status(output.status).json(output);
		});
});

router.patch('/:_id', function(req, res) {
	var output = {
		status: 200
	};
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
