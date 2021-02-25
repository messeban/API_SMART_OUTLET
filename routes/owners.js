
const express = require('express');

const ownersController = require('../controllers/owners');

const router = express.Router();

// GET /feed/posts
router.get('/', ownersController.getOwners);
router.get('/:id', ownersController.getOwner);
router.get('/:id/outlets', ownersController.getOutlets);

router.post('/create', ownersController.createAccount);

module.exports = router;