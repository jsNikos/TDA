var express = require('express');
var router = express.Router();
var business = require('../business');

router.use(function(req, res, next) {
	  console.log('%s %s %s', req.method, req.url, req.path);
	  next();
});

router.post('/startSimulation', function(req, res) {
	business.simulator.start();
	res.status(200).end();
});

router.post('/stopSimulation', function(req, res) {
	business.simulator.stop(); 
	res.status(200).end();
});

module.exports = router;
