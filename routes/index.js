var express = require('express');
var router = express.Router();
var business = require('../business');

router.use(function(req, res, next) {
	  console.log('%s %s %s', req.method, req.url, req.path);
	  next();
});

// complexes
/**
 * Starts to create complex on the given data based on given algorithm.
 * @request: {algorithm: string, options: {maxScale: number, maxDim: integer}, data: []}
 */
router.post('/complexes/start', function(req, res) {
	business.algorithmService.start(req.body.algorithm, req.body.data, req.body.options);
	res.status(200).end();
});

router.post('/complexes/stop', function(req, res) {
	//TODO
	res.status(200).end();
});



// simulations
router.post('/simulations/start', function(req, res) {
	business.simulationService.start();
	res.status(200).end();
});

router.post('/simulations/stop', function(req, res) {
	business.simulationService.stop(); 
	res.status(200).end();
});

module.exports = router;
