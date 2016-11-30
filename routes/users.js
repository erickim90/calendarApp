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
        })
        .then(function (result) {
          if(result.length === 0){
            reject('NO matches found!');
          }
          else{
            resolve(result);
          }
        });
  });
};

//Has access to the properties of NEW instance of User that was created {username:"eckim90"};
//allows the comparison of the model to the new instance using "this".
userSchema.methods.findSimilar = function(cb){
  return this.model('User').find({username : this.username}, cb)
};

//Connected to the collection itself and not a new instance
//allows queries on the collection itself without a newly created instance.
userSchema.statics.findPasswords = function(cb){
  return this.find({password: 'mypassword'}, cb)
};

var User = mongoose.model('User', userSchema);



/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');

});

/* GET users listing. */
router.post('/instance', function(req, res, next) {

  var eric = new User({username:'soboke'});

  eric.findSimilar(function(err,doc){
    res.json(doc)
  });

});

router.get('/static', function(req, res, next) {

  User.findPasswords(function(err,doc){
    res.json(doc)
  });

});

router.get('/promise', function(req, res, next) {

  var eric = new User({username:'soboke'});

  eric.findThisAnd('Hoboken')//a promise
      .then(function(resolve){//on resolve
        res.send(resolve)
      })
      .catch(function(reject){//on reject/catch
        res.send(reject)
      });

});

module.exports = router;