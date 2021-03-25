
const express = require('express');

const outletsController = require('../controllers/outlets');
const authenticate = require('./../util/authenticate');

const router = express.Router();

// GET /feed/posts
router.get('/',authenticate.authenticateToken, outletsController.getOutlets);
router.get('/:id',authenticate.authenticateToken, outletsController.getOutlet);
router.get('/:id/user', outletsController.getUser);
router.get('/:id/location', outletsController.getLocation);
router.get('/:id/location/room', outletsController.getLocation);

router.post('/:id/state', outletsController.postState);
router.post('/newOutlet', outletsController.newOutlet);



module.exports = router;