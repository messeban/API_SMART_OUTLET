
const express = require('express');

const outletsController = require('../controllers/outlets');
const authenticate = require('./../util/authenticate');

const router = express.Router();

// GET /feed/posts
router.get('/',authenticate.authenticateToken, outletsController.getOutlets);
router.get('/:id',authenticate.authenticateToken, outletsController.getOutlet);

router.get('/:id/user', outletsController.getUser);
router.get('/:id/location', outletsController.getLocation);
router.get('/:id/location/room', outletsController.getRoom);
router.get('/room/:id', authenticate.authenticateToken,outletsController.getOutletsFromRoom)

router.post('/:id/state', outletsController.postConnected);
router.post('/newOutlet',authenticate.authenticateToken, outletsController.newOutlet);

router.post("/sendData",outletsController.receiveData);
router.get('/averages/hourly', outletsController.getHourlyAverage);

module.exports = router;