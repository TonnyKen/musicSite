var express = require('express');
var router = express.Router();

router.get('/mainPage',function(req, res, next) {
  res.render('MainPage/FirstPage');
});

module.exports = router;
