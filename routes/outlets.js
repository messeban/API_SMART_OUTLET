
const express = require('express');

const outletsController = require('../controllers/outlets');

const router = express.Router();

// GET /feed/posts
router.get('/', outletsController.getOutlets);
router.get('/:id', outletsController.getOutlet);
router.get('/:id/owner', outletsController.getOwner);
router.get('/:id/location', outletsController.getLocation);

router.post('/:id/state', outletsController.postState);



module.exports = router;