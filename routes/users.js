var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username : 'String',
  password : 'String',
  email : 'String',
  firstName : 'String',
  createAt: {type : Date, default: Date.now()}
});
//instance methods are applied to NEWLY created INSTANCES
userSchema.methods.findThisAnd = function(name){
  //ensure 'this' is set to the new instance of User {username:'Eric'}
  var that = this;
  //create a new promise
  return new Promise(function(resolve, reject) {
    that.model('User')
        .find({
          $or: [
            {username: that.username},
            {username: name }
          ]
        },{}).limit(3).sort({createAt: 1})//queries
        .then(function (result) {
          if(result.length === 0){
            resolve('no matches found!');
          }
          else{
            var obj = {
              message : "Can't create, matches found!",
              data : result
            };
            reject(obj);
          }
        });
  });
};
//Has access to the properties of NEW instance of User that was created {username:"eckim90"};
//allows the comparison of the model to the new instance using "this".
userSchema.methods.usernameValid = function(cb){
  return this.model('User').find({username : this.username}, cb)
};
//Connected to the collection itself and not a new instance
//allows queries on the collection itself without a newly created instance.
userSchema.statics.findPasswords = function(cb){
  return this.find({password: 'mypassword'}, cb)
};
//Check all save actions for duplicate emails
userSchema.pre('save', function(next) {
  User.findOne({email:this.email})
      .exec(function(err,doc){
        var error;

        if(doc){
          error = new Error('Duplicate Email');
          next(error);
        }
        else{
          next();
        }
      })
});

userSchema.post('save', function(doc) {
  console.log('%s has been saved', doc);
});

var User = mongoose.model('User', userSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('ok')
});

router.post('/instance', function(req, res) {

  var eric = new User(req.body);

  eric.usernameValid(function(err,doc){
    if(err){
      res.send(err)
    }
    else if(doc.length !== 0){
      res.send('Username already Taken')
    }
    else{
      eric.save(function(err,doc){
        if(err){
          res.send(err.message)
        }
        else{
          res.send(doc)
        }
      });
    }
  });

  //pre response will be in the err callback
  //witout usernameValid instance method
  // User.create(req.body, function(err,doc){
  //   if(err){
  //     res.send(err.message)
  //   }
  //   else{
  //     res.send(doc)
  //   }
  // })

});

router.get('/static', function(req, res, next) {
  //get all passwords from document
  User.findPasswords(function(err,doc){
    res.json(doc)
  });

});

router.get('/aggregate',function(req,res){
  // Created with 3T MongoChef, the GUI for MongoDB - https://3t.io/mongochef
  //aggregate is not a find, its to calculate and create something specific
  User.aggregate(

      // Pipeline
      [
        // Stage 1
        {
          $limit: 5
        },

        // Stage 2
        {
          $sort: {
            createdAt: -1
          }
        },

      ],function(err,doc){
        res.json(doc)
      });
});

router.get('/query',function(req,res) {

  //using find with queries to retrieve documents (un-aggregated) in a certain way
  User.find({username:'soboke'})
      .limit(3)
      .sort({createAt : 1})
      .select({_id:0})
      .exec(function(err,doc){
        res.send(doc)
      })

});

router.post('/promise', function(req, res, next) {

  var eric = new User(req.body);

  eric.findThisAnd('sobokes')//a promise
      .then(function(resolve){//on resolve
        res.send(resolve)
      })
      .catch(function(reject){//on reject/catch
        res.send(reject)
      });

});


module.exports = router;