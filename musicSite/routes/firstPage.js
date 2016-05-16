var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/MusicSite';

var user;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('NewTest');
});

router.get('/mainPage',function(req, res) {
  var login = req.query.login;
  console.log(login);
  if (login === '1')
    res.render('MainPage/FirstPage',{user:user});
  else
    res.render('MainPage/FirstPage');
});

router.get('/reg',function(req, res, next) {
  res.render('Regist/reg');
});

router.post('/reg/login',function(req, res){
  findUser(req.body['log-username'], req.body['log-password'], function(username){
    console.log(username + "what happened");
    if (username){
      user = username;
      res.redirect('/mainPage/?login=' + 1);}
  });
});

router.post('/reg/register',function(req, res){
  username = insertUser(req.body['reg-username'], req.body['reg-password'], req.body['reg-email'],function(username){
      if (username){res.render('MainPage/FirstPage', {user:username});}
  });
});



module.exports = router;

// Use connect method to connect to the server
var startConnect = function(){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected succesfully to server");

    db.close();
  });
};


var findUser = function(username, password, callback){
  MongoClient.connect(url, function(err, db){
  	if(err){return console.dir(err);}
  	var collection = db.collection('user');
    collection.find({username: username, password: password}).toArray(function(err, item) {
      assert.equal(null, err);
      if (item.length === 1){
        console.log('find user');
        db.close();
        console.log(item[0]['username']);
        callback(item[0]['username'])
      }
      else{
        console.log('do not find user');
        db.close();
        return;
      }
    });
  });
}

var insertUser = function(username, password, email, callback){
  MongoClient.connect(url, function(err, db){
  	if(err){return console.dir(err);}
  	var collection = db.collection('user');
    collection.find({username: username}).toArray(function(err, item) {
      assert.equal(null, err);
      if (item.length === 1){
        console.log('user exist');
        db.close();
        return;
      }
      else{
        collection.insert({username:username, password:password, email:email},{w:1},function(err, result){});
        console.log('insert successed');
        db.close();
        callback(username);
      }
    });
  });
}


    // else{
    //   console.log('do not find user');
    // }
  	//collection.findOne({username:''}, function(err, item) {}).toArray(function(err, items) {console.log(items);});


var checkEmail = function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
};
