
const express = require('express');

const outletsController = require('../controllers/outlets');

const router = express.Router();

// GET /feed/posts
router.get('/', outletsController.getOutlets);

module.exports = router;